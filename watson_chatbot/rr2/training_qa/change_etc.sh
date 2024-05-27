#!/bin/bash

FILE=ranker_train_ja.csv
cp ${FILE} ${FILE}.save
iconv -f sjis -t utf8 ${FILE} > ${FILE}.utf8
tr \\r \\n <${FILE}.utf8 >${FILE}
rm -f ${FILE}.utf8
