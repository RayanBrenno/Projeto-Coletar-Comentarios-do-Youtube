from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pandas as pd

# Carregando os dados
df = pd.read_csv("Projeto/comentarios_rotulados.csv")

# Vetorização
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["comentario"])
y = df["intencao"]

# Treinamento do modelo
modelo = LogisticRegression()
modelo.fit(X, y)

# Função de classificação
def classificar_intencao(texto):
    vetor = vectorizer.transform([texto])
    return modelo.predict(vetor)[0]

# Exemplo
comentario = "Volta tin, pfv, volta logo 😭"
print(classificar_intencao(comentario))
