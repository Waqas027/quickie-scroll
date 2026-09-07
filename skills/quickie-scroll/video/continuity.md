# Continuity — writing clip *n* from clip *n−1*

*Every clip after the first is written from the frame that actually came back, never from the plan.*

**Read with:** [`animation/chain.md`](../animation/chain.md) · [`video/prompting.md`](prompting.md) · [`project/handoff-loop.md`](../project/handoff-loop.md)

---

Never write the whole video pack up front on the manual path. Write clip 1, get the
rendered video back, **look at its actual last frame**, then write clip 2 *from what that
frame shows* — not from what the chapter plan said it would show. Models drift, and a
prompt written against an imagined frame is a prompt written against the wrong frame.

Concretely, for each new clip:

1. Extract `last-NN.png` and open it.
2. Fill START from that image — the three or four things actually in it.
3. Carry HOLD forward unchanged, plus anything new the frame introduced.
4. Check the previous clip's FINAL FRAME line against the real frame. If they disagree, the
   real frame wins, and the disagreement is worth one line in `brief.md` — it usually
   predicts the same drift in the next clip.


---

# Connector prompt (architecture B only)

Start frame = the previous clip's **actual last frame**; end frame = the next clip's
**actual first frame**. Both extracted from the rendered videos, never re-rendered. Same
seven blocks, with CAMERA and THROUGH carrying the arc:

```text
CAMERA: One continuous camera move, no cuts. The camera pulls up and back out of <SCENE i>,
rises, glides across the connected world and arrives above <SCENE i+1>, beginning to
descend toward it.
THROUGH: One seamless flowing aerial transition — the world stays one continuous place, and
<SCENE i+1> is already visible ahead as the camera rises.
```

Duration 5 s. For the last connector into a hero-product finale: "…glides forward and the
world dissolves toward a single <PRODUCT> alone in soft <BG> space, arriving in front of it."

