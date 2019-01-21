import shutil, os
import sql
conn, cursor = sql.connect()
rootDir = os.getcwd()[:-10]

def uploadChall():
    id = int(raw_input("chall id : "))
    title = raw_input("chall title : ")
    flag = raw_input("flag : ")
    tags = raw_input("tags(seperate by space) : ").split()
    attachSrc = raw_input("attachment path : ")
    descSrc = raw_input("desc.md path: ")

    challPath = rootDir+'challs/'+str(id)
    attachPath = challPath+'/attach/'

    if sql.uploadChallQuery(conn,cursor,id,title,flag,tags) == -1 :
        return -1

    if os.path.isfile(attachSrc) and os.path.isfile(descSrc):
        os.mkdir(challPath)
        os.mkdir(attachPath)
        shutil.copy(attachSrc,attachPath)
        shutil.copy(descSrc,challPath)
    else:
        print "attachment or desc is not exist"

def deleteChall():
    title = raw_input("chall title : ")

    id = sql.challTitleToId(conn,cursor,title)
    challPath = rootDir+'challs/'+str(id)

    shutil.rmtree(challPath)
    sql.deleteChallQuery(conn,cursor,title,id)

def resetChalls():
    sure = raw_input("this will delete every data related to challenge from service"
                                     "\nARE YOU SURE? [Y/N] ")    
    if sure == 'Y':
        print "OK,,, reset in progress"
        sql.deleteAllChallQuery(conn,cursor)
    else:
        print "reset canceled"

def printMenu():
    print '\n\n=======[Menu]======='
    print '1. uploadChall'
    print '2. deleteChall'
    print '3. resetChall'
    print '4. exit'

def mainRoutine():
    while 1:
        printMenu()
        choice = int(raw_input('> '))
        if choice == 1:
            uploadChall()
        elif choice == 2:
            deleteChall()
        elif choice == 3:
            resetChalls()
        elif choice == 4:
            quit()
        else :
            print "invalid choice"

mainRoutine()