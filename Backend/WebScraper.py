from bs4 import BeautifulSoup as soup
from urllib.request import urlopen, Request
import re


def cleanhtml(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext


def find_captions(label):
    page_url = 'https://www.google.com/search?q=' + label + '+instagram+captions'

    print(page_url)

    req = Request(page_url, headers={'User-Agent': 'XYZ/3.0'})
    response = urlopen(req, timeout=20).read()

    # print(response)

    page_soup = soup(response, "html.parser")
    containers = page_soup.findAll("li", {"class": "v9i61e"})

    data = []
    for container in containers:
        data_dict = {
            "tag": label
        }
        data_dict.update({"caption": cleanhtml(str(container))})
        data.append(data_dict)

    return data

# print(find_captions("beach"))


