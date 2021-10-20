from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os


app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('rectangle.html')


@app.route('/save', methods=['GET', 'POST'])
def save():
    print(f"request for download made, method: {request.method}")
    if request.method == "POST":
        print(request.data)
        data = request.data.decode("utf-8")
        print(type(data))
        with open('static/rectangle.svg', 'w', encoding="utf-8") as file:
            file.write(data)

        return redirect(url_for('home'))
    return redirect(url_for('home'))


@app.route('/download')
def download():
    return send_from_directory('static', "rectangle.svg", as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
