import pymysql
import getpass

def connect():
    password = getpass.getpass()
    conn = pymysql.connect('localhost','root',password,charset='utf8',database='ctf_review')
    cursor = conn.cursor()
    return conn, cursor

def isExistQuery(conn,cursor,table, id):
    query = "SELECT 1 FROM {} WHERE id = {};".format(table,id)
    print query
    cursor.execute(query)
    exist = cursor.fetchone()
    return 1 if exist else 0

def deleteAllChallQuery(conn,cursor):
    query = "DELETE FROM challs;"
    print query
    cursor.execute(query)
    
    query = "DELETE FROM tagchalls;"
    print query
    cursor.execute(query)

    query = "DELETE FROM UserChalls"
    print query
    cursor.execute(query)

    conn.commit()

def challTitleToId(conn,cursor,title):
    query = "SELECT id FROM challs WHERE title = '{}'".format(title)
    print query
    cursor.execute(query)
    id = cursor.fetchone()[0]

    return id

def uploadChallQuery(conn,cursor,id,title,flag,tags):
    print "[upload challenge]"
    print "CHALLENGE INFO : id = {}, title= '{}', flag = '{}', tags = {}".format(id,title,flag,tags)

    if isExistQuery(conn,cursor,'challs',id):
        print "Challenge already exist!!"
        print "Inspection needed..."
        return -1

    query =("INSERT INTO challs(id,title,flag,createdAt,updatedAt)"
                    " VALUES({},'{}','{}',CURRENT_TIME(),CURRENT_TIME());".format(id,title,flag))
    print query
    cursor.execute(query)

    query = "INSERT INTO tagchalls(tag,challId,createdAt,updatedAt) VALUES"
    for tag in tags:
        query += "('{}', {}, CURRENT_TIME(), CURRENT_TIME()),".format(tag,id)
    query = query[:-1]
    print query
    cursor.execute(query)

    conn.commit()
    return 1

def deleteChallQuery(conn,cursor,title,id=0):
    print "[delete challenge]"
    print "title = '{}'".format(title)

    if not id:
        id = challTitleToId(conn,cursor,title)

    query = "DELETE FROM tagchalls WHERE challId = {}".format(id)
    print query
    cursor.execute(query)

    query = ("DELETE FROM challs "
                    "WHERE id = {}".format(id))
    print query
    cursor.execute(query)

    conn.commit()  
 
def uploadManyQuery(conn,cursor,challs):
    for chall in challs:
        uploadChallQuery(chall[0],chall[1],chall[2],chall[3])

def deleteManyQuery(conn,cursor,titles):
    for title in titles:
        deleteChallQuery(title)