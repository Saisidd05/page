from collections import deque


def parse_reference_string(reference_text):
    """Parse comma or space separated reference string."""
    if not reference_text or not str(reference_text).strip():
        raise ValueError("Reference string cannot be empty.")

    tokens = [
        t.strip()
        for t in str(reference_text).replace(",", " ").split()
        if t.strip()
    ]

    pages = []

    for token in tokens:
        if not token.isdigit():
            raise ValueError(
                f"Invalid value '{token}'. Use only positive integers."
            )

        pages.append(int(token))

    if not pages:
        raise ValueError("Reference string is empty.")

    return pages


def build_result(reference, frame_count, replace_fn):
    frames = [None] * frame_count

    steps = []
    hits = 0
    faults = 0

    for current_index, page in enumerate(reference):

        if page in frames:
            hits += 1

            steps.append({
                "page": page,
                "frames": frames.copy(),
                "hit": True
            })

            continue

        faults += 1

        if None in frames:
            empty = frames.index(None)
            frames[empty] = page

        else:
            replace_index = replace_fn(
                reference,
                frames,
                current_index
            )

            frames[replace_index] = page

        steps.append({
            "page": page,
            "frames": frames.copy(),
            "hit": False
        })

    return steps, faults, hits


# ---------------- FIFO ----------------

def fifo(reference, frame_count):

    frames = [None] * frame_count
    queue = deque()

    steps = []
    hits = 0
    faults = 0

    for page in reference:

        if page in frames:

            hits += 1

            steps.append({
                "page": page,
                "frames": frames.copy(),
                "hit": True
            })

            continue

        faults += 1

        if None in frames:

            empty = frames.index(None)

            frames[empty] = page

            queue.append(page)

        else:

            oldest = queue.popleft()

            replace = (
                frames.index(oldest)
                if oldest in frames
                else 0
            )

            frames[replace] = page

            queue.append(page)

        steps.append({
            "page": page,
            "frames": frames.copy(),
            "hit": False
        })

    return steps, faults, hits


# ---------------- LRU ----------------

def lru(reference, frame_count):

    def replace(reference, frames, current):

        last_used = {}

        for p in frames:

            found = -1

            for i in range(current - 1, -1, -1):

                if reference[i] == p:
                    found = i
                    break

            last_used[p] = found

        victim = min(
            last_used,
            key=last_used.get
        )

        return frames.index(victim)

    return build_result(
        reference,
        frame_count,
        replace
    )


# ---------------- OPTIMAL ----------------

def optimal(reference, frame_count):

    def replace(reference, frames, current):

        next_use = {}

        for p in frames:

            next_index = float("inf")

            for i in range(current + 1, len(reference)):

                if reference[i] == p:
                    next_index = i
                    break

            next_use[p] = next_index

        victim = max(
            next_use,
            key=next_use.get
        )

        return frames.index(victim)

    return build_result(
        reference,
        frame_count,
        replace
    )


# ---------------- MFU ----------------

def mfu(reference, frame_count):

    def replace(reference, frames, current):
        frequency = {p: 0 for p in frames}

        for i in range(current):
            page = reference[i]
            if page in frequency:
                frequency[page] += 1

        victim = max(frequency, key=frequency.get)
        return frames.index(victim)

    return build_result(
        reference,
        frame_count,
        replace
    )


# ---------------- TABLE ----------------

def create_table(steps, frame_count):

    rows = []

    for frame in range(frame_count):

        row = []

        for step in steps:

            value = step["frames"][frame]

            row.append(
                value
                if value is not None
                else "-"
            )

        rows.append(row)

    indicators = []

    for step in steps:

        indicators.append(
            "*"
            if step["hit"]
            else "F"
        )

    return {
        "frameRows": rows,
        "faultRow": indicators
    }


# ---------------- MAIN ----------------

def calculate(data):

    pages = parse_reference_string(
        data.get("reference")
    )

    try:
        frame_count = int(
            data.get("frames")
        )

    except:
        raise ValueError(
            "Frames must be integer."
        )

    if frame_count <= 0:
        raise ValueError(
            "Frames must be greater than 0."
        )

    frame_count = min(
        frame_count,
        len(pages)
    )

    total = len(pages)

    algorithms = {}

    compare = []

    all_methods = {
        "FIFO": fifo,
        "LRU": lru,
        "Optimal": optimal,
        "MFU": mfu,
    }

    selected = data.get("algorithms")
    if isinstance(selected, list) and selected:
        selected = [str(name) for name in selected]
    else:
        selected = ["FIFO", "LRU", "Optimal", "MFU"]

    methods = [
        (name, all_methods[name])
        for name in ["FIFO", "LRU", "Optimal", "MFU"]
        if name in selected and name in all_methods
    ]

    if not methods:
        raise ValueError("Select at least one page replacement algorithm.")

    for name, algo in methods:

        steps, faults, hits = algo(
            pages,
            frame_count
        )

        result = {
            "totalFaults": faults,
            "totalHits": hits,

            "faultRate":
                round(
                    faults / total * 100,
                    2
                ),

            "hitRate":
                round(
                    hits / total * 100,
                    2
                ),

            "successRate":
                round(
                    hits / total * 100,
                    2
                ),

            "steps": [
                {
                    "page": s["page"],

                    "frames": [
                        x
                        if x is not None
                        else "-"
                        for x in s["frames"]
                    ],

                    "indicator":
                        "*"
                        if s["hit"]
                        else "F"
                }

                for s in steps
            ],

            "table":
                create_table(
                    steps,
                    frame_count
                )
        }

        algorithms[name] = result

        compare.append({
            "algorithm": name,
            "faults": faults,
            "hits": hits,
            "faultRate": result["faultRate"],
            "successRate": result["successRate"]
        })

    return {
        "reference": pages,
        "frameCount": frame_count,
        "algorithms": algorithms,
        "comparison": compare
    }