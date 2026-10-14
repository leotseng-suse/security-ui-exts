#!/bin/bash

_PASSWORD_="NODESUDOPASSWORD"

_test_ts_=$(date '+%Y%m%d_%H%M%S')
_date_run_=$(date '+%Y-%m-%d_[%H:%M:%S]')


# environment variables
export TEST_USERNAME=admin
export TEST_PASSWORD=RANCHERUSERPASSWORD

clear # clear screen


pw_report_dir="playwright-report/"
pw_jsonreports_dir="jsonReports/"
pw_testresults_dir="test-results/"

_init_()
{       echo "* Clean up the screenshots, video, jsons folders, etc ......"
	echo "* ---------------------------------------------------------- *"
	echo $_PASSWORD_ | sudo -S rm -rf ${pw_report_dir}/*
	echo $_PASSWORD_ | sudo -S rm -rf ${pw_jsonreports_dir}/*
	echo $_PASSWORD_ | sudo -S rm -rf ${pw_testresults_dir}/*
	
	echo $_PASSWORD_ | sudo -S rm -rf ${pw_testresults_dir}/.last-run*

	sleep 3

	if [ -z "$(ls -A ${pw_report_dir})" ] && [ -z "$(ls -A ${pw_jsonreports_dir})" ] && [ -z "$(ls -A ${pw_testresults_dir})" ]; then
		echo "Directory is empty, continue testing..."; 
	else    
		echo "Directory Not Empty, EXIT!";
	        exit 1 	
	fi
}

_init_


mkdir -p _reports_/SBOMSCANNER_UITEST_${_test_ts_} || {  echo "Create folder failed! Exiting script.";  }

: <<'comment'
if [ $? -eq 0 ]; then
    echo "Process completed successfully."
else
    echo "Process failed."
    # Optionally, exit the script with a failure status
    exit 1
fi
comment

# start playwright test
# npx playwright test --retries=1 --trace on
# npx playwright test --retries=0 > log_${_date_run_}.txt
#npx playwright test tests/sbomscanner.test.ts tests/sbomscanner_registries.test.ts > _reports_/${_test_ts_}_SBOMSCANNERUI/output.log 
npx playwright test --retries=0 --grep @ui > _reports_/SBOMSCANNER_UITEST_${_test_ts_}/output.log 

echo "---------------------------------------------------"
echo "- UI Test Completed - "
echo "---------------------------------------------------"

echo "---------------------------------------------------"
echo "Moving all related files to the test result folder:"
echo "---------------------------------------------------"
echo ""

cp -r uiversion.json _reports_/SBOMSCANNER_UITEST_${_test_ts_} || {  echo "Copy uiversion failed! Exiting script.";  }
sleep 1
#cp -r output.log _reports_/SBOMSCANNER_UITEST_${_test_ts_} || {  echo "Copy output.log failed! Exiting script.";  }
#sleep 1
cp -r ${pw_report_dir}/* _reports_/SBOMSCANNER_UITEST_${_test_ts_} || {  echo "Copy report dir failed! Exiting script.";  }
sleep 3
cp -r ${pw_jsonreports_dir}/* _reports_/SBOMSCANNER_UITEST_${_test_ts_} || {  echo "Copy jsonreport failed! Exiting script.";  }
sleep 3
cp -r ${pw_testresults_dir}/* _reports_/SBOMSCANNER_UITEST_${_test_ts_} || {  echo "Copy testresult failed! Exiting script.";  }
sleep 1

sleep 2
echo ""
echo "Done copying files to the appropriate folder        *"
echo "-----------------------------------------------------"
echo "<<Cosolidating the report directory summary in HTML>>"

./report_summary.sh

echo ""

