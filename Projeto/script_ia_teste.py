import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

def treinar_modelos():
    """
    Treina modelos de classificação de sentimento e intenção a partir de um dataset de comentários.
    """
    df = pd.read_csv("Projeto/comentarios_dataset.csv")

    X_train, _, y_sent_train, _ = train_test_split(
        df['comentario'], df['sentimento'], test_size=0.2, random_state=42)
    _, _, y_intencao_train, _ = train_test_split(
        df['comentario'], df['intencao'], test_size=0.2, random_state=42)

    vectorizer = TfidfVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)

    modelo_sentimento = LogisticRegression(max_iter=1000)
    modelo_sentimento.fit(X_train_vec, y_sent_train)

    modelo_intencao = LogisticRegression(max_iter=1000)
    modelo_intencao.fit(X_train_vec, y_intencao_train)


    def classificar_comentario(texto):
        vec = vectorizer.transform([texto])
        sentimento = modelo_sentimento.predict(vec)[0]
        intencao = modelo_intencao.predict(vec)[0]
        return sentimento, intencao


    joblib.dump(modelo_sentimento, "Projeto/modelosIA/modelo_sentimento.pkl")
    joblib.dump(modelo_intencao, "Projeto/modelosIA/modelo_intencao.pkl")
    joblib.dump(vectorizer, "Projeto/modelosIA/vetor_tfidf.pkl")
