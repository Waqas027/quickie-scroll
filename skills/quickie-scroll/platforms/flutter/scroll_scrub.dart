// // ============================================================================
// // scroll_scrub.dart — scroll-driven cinematic scaffold for Flutter / Android
// // ----------------------------------------------------------------------------
// // The app-target counterpart to quickie-scroll.js. Same idea: scroll drives a
// // camera. Different mechanism, on purpose.
// //
// // WHY FRAMES, NOT VIDEO
// //   The web engine scrubs `video.currentTime`. Doing the same in Flutter means
// //   video_player -> ExoPlayer/AVPlayer `seekTo`, and a seek costs a decode from
// //   the nearest keyframe. On a mid-range Android that lands around 60-120ms per
// //   seek, so a fast fling queues seeks it can never service and the frame
// //   freezes. Scrubbing a pre-extracted image sequence has no decode-from-
// //   keyframe cost at all: every frame is independent, precacheable, and lands in
// //   one raster pass.
// //
// //   The trade is disk. At 9:16 / 720x1280 / q=4 JPEG a frame is ~55-75 KB, so a
// //   5s chapter at 12fps is 60 frames ~= 4 MB. Six chapters ~= 25 MB of assets —
// //   acceptable for a brand app, and it ships offline with zero plugins and zero
// //   pub dependencies. If a build genuinely can't spend the space, drop to 8fps
// //   (interpolation below covers it) before reaching for video_player.
// //
// // PRODUCING THE FRAMES (from the same 9:16 clips the web build uses):
// //   ffmpeg -i assets/videos/01-threshold.mp4 -vf "fps=12,scale=720:-2" -q:v 4 \
// //          assets/frames/01-threshold/%03d.jpg
// //   Then declare `assets/frames/` in pubspec.yaml.
// //
// // USAGE
// //   MaterialApp(home: ScrollScrubPage(
// //     brand: 'VELUNE',
// //     hud: HudSpec(system: '01 — THE THRESHOLD', verb: 'scroll to descend'),
// //     chapters: [ Chapter(...), ... ],
// //     acts: [ ActSpec.statement(...), ActSpec.cta(...) ],
// //     theme: ScrubTheme.dark(accent: Color(0xFFE9C77E)),
// //   ));
// // ============================================================================

// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

// // ---------------------------------------------------------------- data model

// class Chapter {
//   /// Asset directory holding the extracted frames, e.g. 'assets/frames/01-threshold'.
//   final String frameDir;

//   /// How many frames are in [frameDir], named 001.jpg .. NNN.jpg.
//   final int frameCount;

//   /// Screen-heights of scroll this chapter occupies. Higher = slower, longer dwell.
//   final double scroll;

//   final String eyebrow;
//   final String title;
//   final String body;
//   final List<String> tags;

//   /// Where the copy sits. Alternate it down the list — six identical bottom-left
//   /// chapters is what makes a good film read as a template.
//   final Alignment align;

//   final Color? accent;

//   const Chapter({
//     required this.frameDir,
//     required this.frameCount,
//     this.scroll = 1.4,
//     this.eyebrow = '',
//     this.title = '',
//     this.body = '',
//     this.tags = const [],
//     this.align = Alignment.bottomLeft,
//     this.accent,
//   });

//   String frameAt(int i) =>
//       '$frameDir/${(i + 1).clamp(1, frameCount).toString().padLeft(3, '0')}.jpg';
// }

// class HudSpec {
//   final String system;
//   final String verb;
//   final bool frames;
//   const HudSpec({this.system = '', this.verb = '', this.frames = true});
// }

// class ScrubTheme {
//   final Color bg, ink, inkSoft, accent;
//   final String? displayFont, bodyFont;
//   const ScrubTheme({
//     required this.bg,
//     required this.ink,
//     required this.inkSoft,
//     required this.accent,
//     this.displayFont,
//     this.bodyFont,
//   });

//   factory ScrubTheme.dark({Color accent = const Color(0xFFD4AF6A)}) => ScrubTheme(
//     bg: const Color(0xFF0B0C0E),
//     ink: const Color(0xFFF2EAD9),
//     inkSoft: const Color(0xFFB9AE9C),
//     accent: accent,
//   );
// }

// /// A panel that scrolls up over the finished film. Mirrors `acts` in the web engine.
// class ActSpec {
//   final Widget Function(BuildContext, ScrubTheme) build;
//   const ActSpec(this.build);

//   factory ActSpec.statement({String eyebrow = '', required String title, String body = ''}) =>
//       ActSpec(
//         (ctx, t) => _Act(
//           bg: const Color(0xFFF2EFE9),
//           fg: const Color(0xFF171419),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               if (eyebrow.isNotEmpty) _Mono(eyebrow, color: const Color(0x99171419)),
//               if (eyebrow.isNotEmpty) const SizedBox(height: 20),
//               Text(
//                 title,
//                 style: TextStyle(
//                   fontFamily: t.displayFont,
//                   fontSize: 38,
//                   height: 1.05,
//                   letterSpacing: -0.5,
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//               if (body.isNotEmpty) ...[
//                 const SizedBox(height: 20),
//                 Text(
//                   body,
//                   style: TextStyle(
//                     fontFamily: t.bodyFont,
//                     fontSize: 16,
//                     height: 1.6,
//                     color: const Color(0xC7171419),
//                   ),
//                 ),
//               ],
//             ],
//           ),
//         ),
//       );

//   factory ActSpec.cards({String title = '', required List<(String, String)> cards}) => ActSpec(
//     (ctx, t) => _Act(
//       bg: const Color(0xFFF2EFE9),
//       fg: const Color(0xFF171419),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           if (title.isNotEmpty)
//             Text(
//               title,
//               style: TextStyle(
//                 fontFamily: t.displayFont,
//                 fontSize: 30,
//                 height: 1.1,
//                 fontWeight: FontWeight.w500,
//               ),
//             ),
//           const SizedBox(height: 26),
//           for (final c in cards) ...[
//             Container(
//               width: double.infinity,
//               padding: const EdgeInsets.all(26),
//               margin: const EdgeInsets.only(bottom: 14),
//               decoration: BoxDecoration(
//                 color: const Color(0xFF141117),
//                 borderRadius: BorderRadius.circular(20),
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     c.$1,
//                     style: TextStyle(
//                       fontFamily: t.displayFont,
//                       fontSize: 22,
//                       color: const Color(0xFFF2EAD9),
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                   const SizedBox(height: 12),
//                   Text(
//                     c.$2,
//                     style: TextStyle(
//                       fontFamily: t.bodyFont,
//                       fontSize: 14.5,
//                       height: 1.55,
//                       color: const Color(0xB8F2EAD9),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ],
//         ],
//       ),
//     ),
//   );

//   factory ActSpec.cta({required String title, String body = '', required String label}) => ActSpec(
//     (ctx, t) => _Act(
//       bg: Color.alphaBlend(t.accent.withValues(alpha: 0.16), const Color(0xFFEFF2F4)),
//       fg: const Color(0xFF171419),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.center,
//         children: [
//           Text(
//             title,
//             textAlign: TextAlign.center,
//             style: TextStyle(
//               fontFamily: t.displayFont,
//               fontSize: 32,
//               height: 1.1,
//               fontWeight: FontWeight.w500,
//             ),
//           ),
//           if (body.isNotEmpty) ...[
//             const SizedBox(height: 16),
//             Text(
//               body,
//               textAlign: TextAlign.center,
//               style: TextStyle(fontFamily: t.bodyFont, fontSize: 15.5, height: 1.6),
//             ),
//           ],
//           const SizedBox(height: 28),
//           FilledButton(
//             onPressed: () {},
//             style: FilledButton.styleFrom(
//               backgroundColor: const Color(0xFF171419),
//               padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
//               shape: const StadiumBorder(),
//             ),
//             child: Text(label),
//           ),
//         ],
//       ),
//     ),
//   );
// }

// // ---------------------------------------------------------------- the page

// class ScrollScrubPage extends StatefulWidget {
//   final String brand;
//   final List<Chapter> chapters;
//   final List<ActSpec> acts;
//   final HudSpec hud;
//   final ScrubTheme theme;

//   const ScrollScrubPage({
//     super.key,
//     required this.chapters,
//     this.brand = '',
//     this.acts = const [],
//     this.hud = const HudSpec(),
//     this.theme = const ScrubTheme(
//       bg: Color(0xFF0B0C0E),
//       ink: Color(0xFFF2EAD9),
//       inkSoft: Color(0xFFB9AE9C),
//       accent: Color(0xFFD4AF6A),
//     ),
//   });

//   @override
//   State<ScrollScrubPage> createState() => _ScrollScrubPageState();
// }

// class _ScrollScrubPageState extends State<ScrollScrubPage> {
//   final _ctrl = ScrollController();
//   double _y = 0;
//   bool _warmed = false;

//   @override
//   void initState() {
//     super.initState();
//     _ctrl.addListener(() => setState(() => _y = _ctrl.offset));
//     SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
//   }

//   @override
//   void didChangeDependencies() {
//     super.didChangeDependencies();
//     if (_warmed) return;
//     _warmed = true;
//     // Precache the first chapter so the opening frame is never a white flash.
//     // Later chapters warm lazily in _frameFor as the scroll approaches them.
//     final c = widget.chapters.first;
//     for (var i = 0; i < c.frameCount; i++) {
//       precacheImage(AssetImage(c.frameAt(i)), context);
//     }
//   }

//   @override
//   void dispose() {
//     _ctrl.dispose();
//     super.dispose();
//   }

//   /// Screen-heights of scroll the film occupies, before the acts begin.
//   double get _filmExtent => widget.chapters.fold(0.0, (a, c) => a + c.scroll);

//   /// Which chapter the scroll is in, and how far through it (0..1).
//   (int, double) _locate(double vh) {
//     var off = 0.0;
//     for (var i = 0; i < widget.chapters.length; i++) {
//       final w = widget.chapters[i].scroll * vh;
//       if (_y < off + w || i == widget.chapters.length - 1) {
//         return (i, ((_y - off) / w).clamp(0.0, 1.0));
//       }
//       off += w;
//     }
//     return (0, 0);
//   }

//   @override
//   Widget build(BuildContext context) {
//     final vh = MediaQuery.sizeOf(context).height;
//     final t = widget.theme;
//     final (ci, progress) = _locate(vh);
//     final chapter = widget.chapters[ci];
//     final accent = chapter.accent ?? t.accent;
//     final frame = (progress * (chapter.frameCount - 1)).round();

//     // The film is done once the last chapter is fully scrubbed; from there the
//     // acts own the screen and the pinned chrome gets out of the way.
//     final past = _y > _filmExtent * vh - vh * 0.35;

//     // Warm the next chapter's frames while this one is still playing.
//     if (progress > 0.6 && ci + 1 < widget.chapters.length) {
//       final n = widget.chapters[ci + 1];
//       for (var i = 0; i < n.frameCount; i += 3) {
//         precacheImage(AssetImage(n.frameAt(i)), context);
//       }
//     }

//     return Scaffold(
//       backgroundColor: t.bg,
//       body: Stack(
//         children: [
//           // --- the pinned film -------------------------------------------------
//           Positioned.fill(
//             child: AnimatedOpacity(
//               opacity: past ? 0.35 : 1,
//               duration: const Duration(milliseconds: 300),
//               child: Image.asset(
//                 chapter.frameAt(frame),
//                 fit: BoxFit.cover,
//                 gaplessPlayback: true, // no white flash between frames
//                 filterQuality: FilterQuality.medium,
//               ),
//             ),
//           ),

//           // --- readability scrim, on the side the copy speaks from --------------
//           Positioned.fill(
//             child: IgnorePointer(
//               child: DecoratedBox(
//                 decoration: BoxDecoration(
//                   gradient: LinearGradient(
//                     begin: chapter.align.y > 0 ? Alignment.bottomCenter : Alignment.topCenter,
//                     end: chapter.align.y > 0 ? Alignment.topCenter : Alignment.bottomCenter,
//                     colors: [t.bg.withValues(alpha: 0.92), t.bg.withValues(alpha: 0.0)],
//                     stops: const [0.0, 0.62],
//                   ),
//                 ),
//               ),
//             ),
//           ),

//           // --- the scroll surface ----------------------------------------------
//           CustomScrollView(
//             controller: _ctrl,
//             slivers: [
//               SliverToBoxAdapter(child: SizedBox(height: _filmExtent * vh)),
//               for (final a in widget.acts) SliverToBoxAdapter(child: a.build(context, t)),
//               SliverToBoxAdapter(
//                 child: _Footer(brand: widget.brand, theme: t),
//               ),
//             ],
//           ),

//           // --- pinned copy ------------------------------------------------------
//           if (!past)
//             Positioned.fill(
//               child: IgnorePointer(
//                 child: SafeArea(
//                   child: Padding(
//                     padding: const EdgeInsets.fromLTRB(24, 78, 24, 78),
//                     child: Align(
//                       alignment: chapter.align,
//                       child: AnimatedOpacity(
//                         opacity: _copyOpacity(ci, progress),
//                         duration: const Duration(milliseconds: 180),
//                         child: _Copy(chapter: chapter, accent: accent, theme: t),
//                       ),
//                     ),
//                   ),
//                 ),
//               ),
//             ),

//           // --- HUD ---------------------------------------------------------------
//           if (!past)
//             Positioned.fill(
//               child: IgnorePointer(
//                 child: SafeArea(
//                   child: _Hud(
//                     spec: widget.hud,
//                     brand: widget.brand,
//                     theme: t,
//                     frameNo: ((_y / (_filmExtent * vh)).clamp(0.0, 1.0) * _filmExtent * 24).round(),
//                   ),
//                 ),
//               ),
//             ),
//         ],
//       ),
//     );
//   }

//   /// First chapter greets on landing, last one holds, middles peak at their centre.
//   double _copyOpacity(int i, double p) {
//     if (i == 0) return (1 - p / 0.62).clamp(0.0, 1.0);
//     if (i == widget.chapters.length - 1) return (p / 0.4).clamp(0.0, 1.0);
//     return (1 - (p - 0.5).abs() / 0.5).clamp(0.0, 1.0);
//   }
// }

// // ---------------------------------------------------------------- fragments

// class _Copy extends StatelessWidget {
//   final Chapter chapter;
//   final Color accent;
//   final ScrubTheme theme;
//   const _Copy({required this.chapter, required this.accent, required this.theme});

//   @override
//   Widget build(BuildContext context) {
//     final right = chapter.align.x > 0;
//     return ConstrainedBox(
//       constraints: const BoxConstraints(maxWidth: 460),
//       child: Column(
//         mainAxisSize: MainAxisSize.min,
//         crossAxisAlignment: right ? CrossAxisAlignment.end : CrossAxisAlignment.start,
//         children: [
//           if (chapter.eyebrow.isNotEmpty) ...[
//             _Mono(chapter.eyebrow, color: accent),
//             const SizedBox(height: 14),
//           ],
//           Text(
//             chapter.title,
//             textAlign: right ? TextAlign.right : TextAlign.left,
//             style: TextStyle(
//               fontFamily: theme.displayFont,
//               fontSize: 34,
//               height: 1.06,
//               letterSpacing: -0.4,
//               fontWeight: FontWeight.w500,
//               color: theme.ink,
//               shadows: const [Shadow(blurRadius: 22, color: Color(0x8A000000))],
//             ),
//           ),
//           if (chapter.body.isNotEmpty) ...[
//             const SizedBox(height: 16),
//             Text(
//               chapter.body,
//               textAlign: right ? TextAlign.right : TextAlign.left,
//               style: TextStyle(
//                 fontFamily: theme.bodyFont,
//                 fontSize: 15,
//                 height: 1.55,
//                 color: theme.inkSoft,
//               ),
//             ),
//           ],
//           if (chapter.tags.isNotEmpty) ...[
//             const SizedBox(height: 20),
//             Wrap(
//               spacing: 8,
//               runSpacing: 8,
//               alignment: right ? WrapAlignment.end : WrapAlignment.start,
//               children: [
//                 for (final tag in chapter.tags)
//                   Container(
//                     padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
//                     decoration: BoxDecoration(
//                       color: accent.withValues(alpha: 0.14),
//                       border: Border.all(color: accent.withValues(alpha: 0.34)),
//                       borderRadius: BorderRadius.circular(999),
//                     ),
//                     child: Text(
//                       tag,
//                       style: TextStyle(
//                         fontSize: 12.5,
//                         color: theme.ink,
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                   ),
//               ],
//             ),
//           ],
//         ],
//       ),
//     );
//   }
// }

// class _Hud extends StatelessWidget {
//   final HudSpec spec;
//   final String brand;
//   final ScrubTheme theme;
//   final int frameNo;
//   const _Hud({required this.spec, required this.brand, required this.theme, required this.frameNo});

//   @override
//   Widget build(BuildContext context) {
//     final soft = theme.ink.withValues(alpha: 0.6);
//     return Padding(
//       padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
//       child: Stack(
//         children: [
//           if (brand.isNotEmpty)
//             Align(
//               alignment: Alignment.topLeft,
//               child: Text(
//                 brand,
//                 style: TextStyle(
//                   color: theme.ink,
//                   fontSize: 15,
//                   fontWeight: FontWeight.w600,
//                   letterSpacing: 1.6,
//                 ),
//               ),
//             ),
//           if (spec.frames)
//             Align(
//               alignment: Alignment.topRight,
//               child: _Mono('FRAME ${frameNo.toString().padLeft(3, '0')}', color: soft),
//             ),
//           if (spec.system.isNotEmpty)
//             Align(
//               alignment: Alignment.topCenter,
//               child: Padding(
//                 padding: const EdgeInsets.only(top: 30),
//                 child: _Mono(spec.system, color: soft),
//               ),
//             ),
//           if (spec.verb.isNotEmpty)
//             Align(
//               alignment: Alignment.bottomRight,
//               child: _Mono(spec.verb, color: soft),
//             ),
//         ],
//       ),
//     );
//   }
// }

// class _Mono extends StatelessWidget {
//   final String text;
//   final Color color;
//   const _Mono(this.text, {required this.color});

//   @override
//   Widget build(BuildContext context) => Text(
//     text.toUpperCase(),
//     style: TextStyle(
//       fontFamily: 'monospace',
//       fontSize: 10.5,
//       letterSpacing: 2.0,
//       color: color,
//       height: 1.2,
//     ),
//   );
// }

// class _Act extends StatelessWidget {
//   final Color bg, fg;
//   final Widget child;
//   const _Act({required this.bg, required this.fg, required this.child});

//   @override
//   Widget build(BuildContext context) => Container(
//     width: double.infinity,
//     color: bg,
//     padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 72),
//     child: DefaultTextStyle.merge(
//       style: TextStyle(color: fg),
//       child: child,
//     ),
//   );
// }

// class _Footer extends StatelessWidget {
//   final String brand;
//   final ScrubTheme theme;
//   const _Footer({required this.brand, required this.theme});

//   @override
//   Widget build(BuildContext context) => Container(
//     width: double.infinity,
//     color: theme.bg,
//     padding: const EdgeInsets.fromLTRB(26, 44, 26, 60),
//     child: SafeArea(
//       top: false,
//       child: Row(
//         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//         children: [
//           Text(
//             brand,
//             style: TextStyle(color: theme.ink, fontWeight: FontWeight.w600, letterSpacing: 1.4),
//           ),
//           _Mono('© ${DateTime.now().year}', color: theme.inkSoft),
//         ],
//       ),
//     ),
//   );
// }
