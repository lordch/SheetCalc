from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
from cairosvg import svg2png, svg2pdf

PDF_SCALE = 3.77953

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('rectangle.html')


@app.route('/save', methods=['GET', 'POST'])
def save():
    print(f"request for download made, method: {request.method}")
    if request.method == "POST":
        data = request.data.decode("utf-8")
        with open('static/rectangle.svg', 'w', encoding="utf-8") as file:
            file.write(data)
        svg2pdf(url='static/rectangle.svg', scale=PDF_SCALE, write_to='static/rectangle.pdf')
        svg2png(url='static/rectangle.svg', write_to='static/rectangle.png')
        return redirect(url_for('home'))
    return redirect(url_for('home'))


@app.route('/download_pdf')
def download_pdf():
    return send_from_directory('static', "rectangle.pdf", as_attachment=True)


@app.route('/download_png')
def download_png():
    return send_from_directory('static', "rectangle.png", as_attachment=True)

@app.route('/cutting_edge')
def cutting_edge():
    return render_template('cutting_edge.html')


if __name__ == "__main__":
    app.run(debug=True)
