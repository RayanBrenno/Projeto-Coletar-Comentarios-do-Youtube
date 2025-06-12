import pandas as pd
from transformers import pipeline

# 1. Nome do seu arquivo de entrada
nome_arquivo = "Comentarios Id - 8Pkvm8r3nUQ.csv"

# 2. Lê o CSV
df = pd.read_csv(nome_arquivo, encoding="utf-8-sig")
df.columns = df.columns.str.strip()
coluna_texto = "text"

# 3. Carrega o modelo multilíngue
analisador = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# 4. Função para transformar estrelas em sentimento
def interpretar_estrelas(label):
    estrelas = int(label.split()[0])
    if estrelas <= 2:
        return "NEG"
    elif estrelas == 3:
        return "NEU"
    else:
        return "POS"

# 5. Aplica a análise
def classificar_sentimento(texto):
    try:
        resultado = analisador(texto[:512])[0]
        return interpretar_estrelas(resultado["label"])
    except:
        return "erro"

df["sentimento"] = df[coluna_texto].astype(str).apply(classificar_sentimento)

# 6. Salvar resultado
arquivo_saida = "ComentariosClassificados1.csv"
df.to_csv(arquivo_saida, index=False, encoding="utf-8-sig")

print(f"✅ Comentários classificados com sucesso! Salvo como '{arquivo_saida}'")
