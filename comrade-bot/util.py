from html.parser import HTMLParser
from io import StringIO


class StripHTML(HTMLParser):
    """Removes HTML tags from strings"""

    # https://stackoverflow.com/a/925630

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reset()
        self.convert_charrefs = True
        self.text = StringIO()

    def handle_data(self, data: str):
        self.text.write(data)

    def get_data(self):
        return self.text.getvalue()


def remove_html(html: str) -> str:
    s = StripHTML()
    s.feed(html)
    return s.get_data()
