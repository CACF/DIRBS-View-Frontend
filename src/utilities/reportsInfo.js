/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/******************* Core *******************/

export const coreOperatorWiseIMEIs = {
    "Explanation": "Unique IMEIs seen on respective operators.",
    "X-Axis": "Consisted of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const coreOperatorWiseMSISDNs = {
    "Explanation": "Unique MSISDNs seen on respective operators.",
    "X-Axis": "Consisted of dates according to selected granularity.",
    "Y-Axis": "Count of MSISDNs."
}

export const coreNetworkSeenIMEIsByTechnology2G3G4G = {
    "Explanation": "Shows the breakup of Network Seen IMEIs based on Radio Access technology (2G/3G/4G).",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const coreValidInvalidNetworkSeenIMEIs = {
    "Explanation": "Shows the breakup of Network Seen IMEIs based on GSMA Valid / Invalid TACs.",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const coreGrossAddIMEIs = {
    "Explanation": "Shows the trend of Gross Add ( New Seen) IMEIs.",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const coreGrossAddIMEIsByTechnology = {
    "Explanation": "Shows the trend of Gross Add (New Seen) IMEIs based on Radio Access Technology (2G/3G/4G).",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const coreUnBlocking= {
    "Explanation": "Shows the break-up of Un-Blocked IMEIs according to un-blocking reasons..",
    "X-Axis": "Consists of un-blocking reasons.",
    "Y-Axis": "Count of IMEIs."
}

export const coreBlocking = {
    "Explanation": "Shows the break-up of Blocked IMEIs according to blocking reasons.",
    "X-Axis": "Consists of blocking reasons",
    "Y-Axis": "Count of IMEIs."
}


/******************* DRS *******************/

export const dRSImportTrend = {
    "Explanation": "Shows the import trend w.r.t Devices and IMEIs.",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of Devices and IMEIs."
}

export const grossAddIMEIsVsDRSVsNotification = {
    "Explanation": "Shows the division of Gross Add Newly seen IMEIs w.r.t Active IMEIs of DRS, Local Assembly and Notification List.",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const dRSTop10overAllBrands = {
    "Explanation": "Shows the overall top Brands in DRS.",
    "Y-Axis": "Names of Brands according to selected trend quantity.",
    "X-Axis": "Count of IMEIs."
}

export const dRSTop2G3G4GBrands = {
    "Explanation": "Shows the top imported Brands in DRS based on Radio Access technology (2G/3G/4G).",
    "1st-Ring": "Names of RATs.",
    "2nd-Ring": "Names of Brands."
}


/******************* STOLEN *******************/

export const stolenTrendofImeis = {
    "Explanation": "Shows the trend of Stolen IMEIs reported to PTA.",
    "X-Axis": "Consists of dates according to selected granularity.",
    "Y-Axis": "Count of IMEIs."
}

export const stolenDeviceTypeBreakup = {
    "Explanation": "Shows the breakup of Stolen IMEIs in terms of Device Type.",
    "Main-Ring": "Names of types of devices."
}

export const stolenBreakUpByTechnology2G3G4G = {
    "Explanation": "Shows the breakup of Stolen IMEIs in terms of Radio Access Technology (2G/3G/4G).",
    "X-Axis": "Count of IMEIs.",
    "Y-Axis": "Names of Technologies."
}

export const stolenBreakUpByTechnology2G3G4GOverTIME = {
    "Explanation": "Shows the Trend of Stolen IMEIs w.r.t Radio Access Technology (2G/3G/4G).",
    "X-Axis": "Consists of Dates According to Selected Granularity.",
    "Y-Axis": "Count of Stolen IMEIs."
}