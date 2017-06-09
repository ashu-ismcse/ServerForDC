import speech_recognition as sr
 
AUDIO_FILE = ("Files/song.wav")
 
# use the audio file as the audio source
 
r = sr.Recognizer()
 
with sr.AudioFile(AUDIO_FILE) as source:
    #reads the audio file. Here we use record instead of
    #listen
    audio = r.record(source)  

result = "";
 
try:
    st = r.recognize_google(audio)
    print(st)
    if(st == "hello" or st == "hi" or st == "hello there"):
    	result = "Hi There! Please say one"
    elif(st == "one" or st == "1"):
    	result = "please say two"
    elif(st == "two" or st == "2" or st == "to" or st == "too"):
    	result = "Now say your username"
    elif(st == "three" or st == "3"):
    	result = "Now say your username" 
    elif(st == "bangalore" or st == "Bangalore"):
    	result = "Now say your password"
    elif(st == "walmart" or st == "Walmart"):
    	result = "Congratulations you are successfully logged in! To Begin picking say Ready!"
    elif(st == "bye" or st == "Bye"):
        result = "bye"
    else :
    	result = "Please repeat again"
    print("The audio file contains: " + result)
    with open("Files/Output.txt", "w") as text_file:
    	print(result, file=text_file)

 
except sr.UnknownValueError:
    print("Google Speech Recognition could not understand audio")
    with open("Files/Output.txt", "w") as text_file:
        print("Please Check your connection", file=text_file)

 
except sr.RequestError as e:
    print("Could not request results from Google Speech Recognition service; {0}".format(e))
    with open("Files/Output.txt", "w") as text_file:
        print("Please check your Connection", file=text_file)
