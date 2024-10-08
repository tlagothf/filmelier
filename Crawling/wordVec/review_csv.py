# IMPORT START

import sys
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
from kiwipiepy import Kiwi
import fasttext

import codecs

# IMPORT END





# 모델 정의 영역 START

model = fasttext.load_model('cc.ko.100.bin')
kiwi = Kiwi()

# 모델 정의 영역 END

# CSV 파일 출력 함수 START

def exportCSV(movie_name):
    reviewFile = codecs.open('src/filmelier/Crawling/crawling/blog_review/'+movie_name+".txt", 'r', encoding='utf-8')
    reviewTextContent = reviewFile.read()

    categoryFile = codecs.open('category.txt', 'r', encoding='utf-8')
    categoryTextContent = categoryFile.read()

    text_dict = {}
    category_dict = categoryTextContent.split("\n")


    # kiwi 형태소분석 start

    lines = reviewTextContent.split("\n") # 텍스트 컨텐츠 라인 반복
    for line in lines:

        kiwi_list = kiwi.tokenize(line) # kiwi 토큰 반복
        for word in kiwi_list:

            if len(word.form) > 1:
                if word.tag == 'NNG':
                    if word.form not in text_dict:
                        text_dict[word.form] = 0
                    text_dict[word.form] += 1

    # kiwi 형태소분석 end







    wordList = []
    contentList = [] # 카테고리, 유사도, 빈도수

    # fasttext 유사도분석 start

    for textToken in text_dict:

        texttoken_vector = model.get_word_vector(textToken)



        topRankWord = "undefined"
        topRankSimilarity = 0

        for category in category_dict:
            category_vector = model.get_word_vector(category)

            currentSimilarity = 1 - cosine(texttoken_vector, category_vector)

            if currentSimilarity > 0.3:
                if currentSimilarity > topRankSimilarity:
                    topRankSimilarity = currentSimilarity
                    topRankWord = category



        if topRankSimilarity != 0:
            wordList.append(textToken)
            contentList.append([topRankWord, topRankSimilarity, text_dict[textToken]])

    # fasttext 유사도분석 end










    # CSV 출력 START

    df = pd.DataFrame(contentList, index=wordList, columns=['카테고리', '유사도', '빈도'])
    df.to_csv(movie_name+"_data.csv")

    # CSV 출력 END






    # 마지막 정리 코드 모음

    reviewFile.close() # 리뷰 파일 닫기

# CSV 파일 출력 함수 END











# 시작 코드 START

exportCSV("인사이드아웃_review")

# 시작 코드 END

print('end')