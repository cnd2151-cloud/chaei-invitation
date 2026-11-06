"""Skeleton -> ordered centre-line strokes (shared by gen_title.py / gen_doodles.py)."""
import math
import numpy as np
from skimage.morphology import skeletonize
from scipy import ndimage as ndi


def timeline(strokes, start, duration, lift_max=0.02):
    """assign delay/dur to strokes proportional to their length"""
    lens = [float(np.sum(np.linalg.norm(np.diff(a, axis=0), axis=1))) for a, _ in strokes]
    total = sum(lens) or 1
    lift = min(lift_max, 0.2*duration/max(1, len(strokes)-1))
    avail = duration - lift*(len(strokes)-1)
    t = start; out = []
    for (arr, w), L in zip(strokes, lens):
        dur = avail*L/total
        out.append(dict(d=smooth_path(arr), len=round(L*1.08 + w, 1), w=round(w, 1), delay=round(t, 3), dur=round(dur, 3)))
        t += dur + lift
    return out, t - lift

N8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def trace(mask, direction=(1.0, 0.0)):
    H, W = mask.shape
    ux, uy = direction
    dist = ndi.distance_transform_edt(mask)
    sk = skeletonize(mask)
    pts = set(zip(*np.nonzero(sk)))
    def nb(p): return [(p[0]+dy, p[1]+dx) for dy, dx in N8 if (p[0]+dy, p[1]+dx) in pts]
    # prune short spurs (brush texture noise)
    for _ in range(3):
        ends = [p for p in pts if len(nb(p)) == 1]
        for e in ends:
            chain = [e]; cur = e; prev = None
            while True:
                n = [q for q in nb(cur) if q != prev]
                if len(n) != 1 or len(nb(cur)) > 2: break
                prev, cur = cur, n[0]; chain.append(cur)
                if len(chain) > 40: break
            if len(nb(cur)) > 2 and len(chain) < max(6, 1.6*dist[cur]):
                for q in chain[:-1]: pts.discard(q)
    # remove tiny isolated specks
    deg = {p: len(nb(p)) for p in pts}
    nodes = {p for p in pts if deg[p] != 2}
    # walk edges
    visited_edge = set(); edges = []
    def walk(a, b):
        path = [a, b]; prev, cur = a, b
        while cur not in nodes:
            n = [q for q in nb(cur) if q != prev and q not in path[-3:]]
            if not n: break
            prev, cur = cur, n[0]; path.append(cur)
            if cur == a: break
        return path
    for a in nodes:
        for b in nb(a):
            key = frozenset((a, b))
            if key in visited_edge: continue
            p = walk(a, b)
            for i in range(len(p)-1): visited_edge.add(frozenset((p[i], p[i+1])))
            if len(p) >= 3 or (len(p) == 2 and p[1] in nodes and a not in nodes):
                edges.append(p)
    # pure loops (no nodes)
    used = {q for e in edges for q in e}
    rest = pts - used
    while rest:
        s = min(rest, key=lambda p: p[1])
        comp = [s]; prev = None; cur = s
        while True:
            n = [q for q in nb(cur) if q in rest and q != prev and q not in comp[-3:]]
            if not n: break
            prev, cur = cur, n[0]
            if cur == s: break
            comp.append(cur)
        for q in comp: rest.discard(q)
        if len(comp) > 4: edges.append(comp + [s])
    # merge node clusters (adjacent node pixels) -> cluster id
    node_list = list(nodes); cid = {}
    for p in node_list:
        if p in cid: continue
        stack = [p]; cid[p] = p
        while stack:
            q = stack.pop()
            for r in nb(q):
                if r in nodes and r not in cid: cid[r] = p; stack.append(r)
    def key_of(p): return cid.get(p, p)
    edges = [e for e in edges if len(e) > 2 or True]
    # drop trivial edges inside node clusters
    edges = [e for e in edges if not (len(e) <= 3 and key_of(e[0]) == key_of(e[-1]) and e[0] in nodes and e[-1] in nodes)]
    # ---- order strokes like handwriting ----
    remaining = list(range(len(edges)))
    def start_x(i): return min(edges[i][0][1], edges[i][-1][1])
    strokes = []
    while remaining:
        # start: leftmost unused edge endpoint; prefer endpoints of degree 1
        best = None
        for i in remaining:
            e = edges[i]
            for rev in (False, True):
                p = e[-1] if rev else e[0]
                score = (p[1]*ux + p[0]*uy) - (25 if deg.get(p, 2) == 1 else 0) + 0.15*(-p[1]*uy + p[0]*ux)
                if best is None or score < best[0]: best = (score, i, rev)
        _, i, rev = best
        seq = edges[i][::-1] if rev else list(edges[i]); remaining.remove(i)
        while True:
            end = seq[-1]; k = key_of(end)
            if len(seq) >= 6:
                hd = np.array(seq[-1], float) - np.array(seq[-6], float)
            else:
                hd = np.array(seq[-1], float) - np.array(seq[0], float)
            hd /= (np.linalg.norm(hd) + 1e-6)
            cand = []
            for j in remaining:
                e = edges[j]
                for rv in (False, True):
                    s0 = e[-1] if rv else e[0]
                    if key_of(s0) != k and math.dist(s0, end) > 3: continue
                    ee = e[::-1] if rv else e
                    d = np.array(ee[min(5, len(ee)-1)], float) - np.array(ee[0], float)
                    d /= (np.linalg.norm(d) + 1e-6)
                    cand.append((-float(hd @ d), j, rv))
            if not cand: break
            cand.sort()
            if cand[0][0] > 0.55: break   # too sharp a turn -> pen lift
            _, j, rv = cand[0]
            ee = edges[j][::-1] if rv else edges[j]
            seq += list(ee[1:]); remaining.remove(j)
        strokes.append(seq)
    # sort strokes left->right by their start but keep chained order
    out = []
    for s in strokes:
        arr = np.array(s, float)[:, ::-1]  # (x,y)
        if len(arr) < 4: continue
        w = 2*max(dist[p] for p in s) + 3
        out.append((arr, w))
    out.sort(key=lambda t: min(t[0][0, 0]*ux + t[0][0, 1]*uy, (t[0][:, 0]*ux + t[0][:, 1]*uy).min() + 8))
    return out


def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; ab = b - a; L = np.linalg.norm(ab)
    if L < 1e-6: d = np.linalg.norm(pts - a, axis=1)
    else: d = np.abs(ab[0]*(pts[:,1]-a[1]) - ab[1]*(pts[:,0]-a[0]))/L
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([rdp(pts[:i+1], eps)[:-1], rdp(pts[i:], eps)])
    return np.vstack([a, b])


def smooth_path(p):
    p = rdp(p, 1.2)
    if len(p) == 2: return f'M{p[0][0]:.1f} {p[0][1]:.1f}L{p[1][0]:.1f} {p[1][1]:.1f}'
    d = f'M{p[0][0]:.1f} {p[0][1]:.1f}'
    for i in range(len(p)-1):
        p0 = p[i-1] if i > 0 else p[i]; p1 = p[i]; p2 = p[i+1]; p3 = p[i+2] if i+2 < len(p) else p2
        c1 = p1 + (p2-p0)/6; c2 = p2 - (p3-p1)/6
        d += f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d


