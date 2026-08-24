from schemas import Problem


problems = [
    Problem(
        slug="binary-search",
        title="Binary Search",
        difficulty="Medium",
        topic="Searching",
        description="Find an element efficiently in a sorted array.",
        hints=[
            "Think about checking the middle element.",
            "Eliminate half of the search space.",
            "Continue until the target is found or the search space is empty."
        ]
    ),

    Problem(
        slug="two-sum",
        title="Two Sum",
        difficulty="Easy",
        topic="Arrays",
        description="Find two numbers that add up to a given target.",
        hints=[
            "Think about what complement each number needs.",
            "Can you remember numbers you have already seen?"
        ]
    ),

    Problem(
        slug="number-of-islands",
        title="Number of Islands",
        difficulty="Medium",
        topic="Graphs",
        description="Count the number of connected islands in a grid.",
        hints=[
            "Think about DFS or BFS.",
            "Start a traversal whenever you find unvisited land.",
            "Mark all connected land cells as visited."
        ]
    ),

    Problem(
        slug="longest-common-subsequence",
        title="Longest Common Subsequence",
        difficulty="Hard",
        topic="Dynamic Programming",
        description="Find the longest subsequence common to two strings.",
        hints=[
            "Try defining a DP state using positions in both strings.",
            "Consider what happens when the current characters match.",
            "Think about the two possibilities when they do not match."
        ]
    )
]