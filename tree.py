import re

class Node:
    def __init__(self, key, data):
        self.key = key
        self.data = data
        self.left = None
        self.right = None


def insert(node, key, data):
    if node is None:
        return Node(key, data)

    if key < node.key:
        node.left = insert(node.left, key, data)
    elif key > node.key:
        node.right = insert(node.right, key, data)
    else:
        node.data = data

    return node

def search(node, key):
    if node is None:
        return None

    key = key.strip().casefold()

    if key < node.key:
        return search(node.left, key)
    elif key > node.key:
        return search(node.right, key)
    else:
        return node.data


def f_search(node, key):
    if node is None:
        return {}
    key = key.strip().casefold()
    matches = []

    def score(data):
        score = 0
        for field in ("vi", "en", "la"):
            text = data.get(field, "").casefold()
            if key == text:
                score += 100
            elif re.search(rf"\b{re.escape(key)}\b", text):
                score += 50
            elif key in text:
                score += 10

        return score

    def traverse(node):
        if node is None:
            return

        s = score(node.data)
        if s > 0:
            matches.append((s, node.data))
        traverse(node.left)
        traverse(node.right)

    traverse(node)
    if not matches:
        return {}
    matches.sort(key=lambda x: x[0], reverse=True)
    return matches[0][1]


def delete(node, key):
    if node is None:
        return None

    if key < node.key:
        node.left = delete(node.left, key)
    elif key > node.key:
        node.right = delete(node.right, key)
    else:
        if node.left is None:
            return node.right

        if node.right is None:
            return node.left

        temp = node.right
        while temp.left:
            temp = temp.left

        node.key = temp.key
        node.data = temp.data
        node.right = delete(node.right, temp.key)

    return node

def get(node, result=None):
    if result is None:
        result = []

    if node is not None:
        get(node.left, result)
        result.append((node.key, node.data))
        get(node.right, result)

    return result

def count(node):
    if node is None:
        return 0
    return 1 + count(node.left) + count(node.right)


