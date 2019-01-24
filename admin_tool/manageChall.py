import shutil, os
import sql
conn, cursor = sql.connect()
rootDir = os.getcwd()[:-10]

def uploadChall():
    id = sql.getNextId(conn,cursor,'challs')
    title = raw_input("chall title : ")
    flag = raw_input("flag : ")
    tags = raw_input("tags(seperate by space) : ").split()
    draftSrc = '../drafts/{}'.format(title)

    challPath = rootDir+'challs/'+str(id)

    if os.path.isdir(draftSrc):
        shutil.copytree(draftSrc,challPath)
        sql.uploadChallQuery(conn,cursor,id,title,flag,tags)
    else:
        print "draft doesn't exist"

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