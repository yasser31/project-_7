import re
from config import stop_words


def parse(exp):
    split = re.split(" |'", exp.lower())
    for word in split:
        if word not in stop_words:
            query = word

    return query
