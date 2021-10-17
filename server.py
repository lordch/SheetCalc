from flask import Flask, render_template
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('rectangle.html')

if __name__ == "__main__":
    app.run(debug=True)
