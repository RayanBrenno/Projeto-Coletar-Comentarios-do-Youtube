import random

'''
Aqui poderíamos integrar com um modelo de IA real, como o Transformer, para analisar o texto do comentário e determinar a intenção (positivo, neutro ou negativo) com base no conteúdo. No entanto, para fins de demonstração, estamos usando uma função simulada que retorna uma intenção aleatória e um score de confiança.
'''

def analisar_intencao_comentario(texto: str) -> dict:
    intencoes = ["positivo", "neutro", "negativo"]

    return {
        "intencao": random.choice(intencoes),
        "score": round(random.uniform(0.60, 0.99), 2),
    }