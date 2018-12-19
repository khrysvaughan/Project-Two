

import pandas as pd
import json
from flask import Flask, jsonify, render_template

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)


#################################################
# Importing CSV data
#################################################

# Create a reference the CSV file 
csv_housing = "db/State_Zhvi_SingleFamilyResidence.csv"
csv_housingYearlyData = "db/yearlyData.csv"


# Read the CSV into a Pandas DataFrame, convert to dictionary and jsonified
meanHousingPrice_df = pd.read_csv(csv_housing)

meanHousingPrice_dict = meanHousingPrice_df.to_dict(orient='records')
meanHousingPrice_json= json.dumps(meanHousingPrice_dict)

yearlyData_df = pd.read_csv(csv_housingYearlyData)

yearlyData_dict = yearlyData_df.to_dict(orient='records')
yearlyData_json= json.dumps(yearlyData_dict)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/housing")
def housing():
    """Return a list of housing data dictionary"""

    return meanHousingPrice_json

@app.route("/yearly")
def housingYearly():
    """Return a list of housing yearly data"""

    return yearlyData_json

@app.route("/states")
def states():
    """Return the states plot."""
    return render_template("states.html")

@app.route("/compare")
def compare():
    """Return the compare plot."""
    return render_template("compare.html")

@app.route("/multiplot")
def multiplot():
    """Return the compare plot."""
    return render_template("multiplot.html")

@app.route("/charting")
def charting():
    """Return the charting plot."""
    return render_template("Money_Choropleth.html")

@app.route("/writeup/sources")
def sources():
    """Return the source information."""
    return render_template("/writeup/sources.html")

@app.route("/writeup/datamunge")
def datamunge():
    """Return the data munging information."""
    return render_template("/writeup/datamunge.html")

@app.route("/writeup/codeapproach")
def codeapproach():
    """Return the code approach information."""
    return render_template("/writeup/codeapproach.html")

@app.route("/plot1")
def plot1():
    """Return plot 1."""
    return render_template("states.html")

@app.route("/plot2")
def plot2():
    """Return plot 2."""
    return render_template("states.html")

if __name__ == "__main__":
    app.run()
