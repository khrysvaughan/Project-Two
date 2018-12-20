

import pandas as pd
import json
from flask import Flask, jsonify, render_template
import numpy as np
import sys
import mysql.connector

app = Flask(__name__)


#################################################
# Importing CSV data
#################################################

# # Create a reference the CSV file 
# csv_housing = "db/State_Zhvi_SingleFamilyResidence.csv"
# csv_housingYearlyData = "db/yearlyData.csv"


# # Read the CSV into a Pandas DataFrame, convert to dictionary and jsonified
# meanHousingPrice_df = pd.read_csv(csv_housing)

# meanHousingPrice_dict = meanHousingPrice_df.to_dict(orient='records')
# meanHousingPrice_json= json.dumps(meanHousingPrice_dict)

# yearlyData_df = pd.read_csv(csv_housingYearlyData)

# yearlyData_dict = yearlyData_df.to_dict(orient='records')
# yearlyData_json= json.dumps(yearlyData_dict)

conn = mysql.connector.connect(host='localhost',port='3306',
                                           database='housing_db',
                                           user='root'
                                           ,
                                           password='Mnjhuy76!')
cursor = conn.cursor()                                 
if conn.is_connected():
    print('sucessful...Connected to MySQL database')
cursor.execute(" SELECT * FROM yearlydatanew ")
   
jsonFile = []

keys = []
for row in cursor.fetchall():
    row =[x for x in row]

    year = ["Year"]
    if row[0] == 'State':
        keys = ["Year"] + row[1:]

    if row[0] != 'State':
        values = [float(i) for i in row]
        dictionary = dict(zip(keys, values))
        jsonFile.append(dictionary)  
    

csv_Meena = "db/combinedData.csv"

Meena_df = pd.read_csv(csv_Meena)
Meena_df_dict = Meena_df.to_dict(orient='records')
Meena_df_json= json.dumps(Meena_df_dict)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


    # @app.route("/housing")
    # def housing():
    #     """Return a list of housing data dictionary"""

    #     return meanHousingPrice_json

@app.route("/yearly")
def housingYearly():
    """Return a list of housing yearly data"""

    return jsonify(jsonFile)

@app.route("/Meena")
def Meena():

     return Meena_df_json

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

if __name__ == "__main__":
    app.run()
