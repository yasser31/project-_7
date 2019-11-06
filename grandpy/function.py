import re
from config import stop_words

# function that will parse the expression using re


def parse(exp):
    split = re.split(" |'", exp.lower())
    for word in split:
        if word not in stop_words:
            query = word

    return query
