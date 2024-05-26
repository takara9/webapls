#!/usr/bin/python
# coding: UTF-8

import sys
if (len(sys.argv) != 3):
    print "Usae: # python %s input-file output-file" % sys.argv[0]
    quit()


classes = {}
f = open(sys.argv[1])


# クラスをカウント
line = f.readline() 
while line:
    line = line[:-1]
    words = line.split(",")
    if words[1] in classes:
        classes[words[1]] = classes[words[1]] + 1
    else:
        classes[words[1]] = 1
    line = f.readline() 

# 書き込み
f = open(sys.argv[2], 'w')
for key in classes:
    text = key + "," + str(classes[key]) + "\n"
    f.write(text)

f.close()
