from transformers import pipeline
import torch

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def classificar_intencao_zero_shot(texto):
    labels = ["elogio", "crítica", "dica", "pedido", "neutro"]
    resultado = classifier(texto, candidate_labels=labels)
    return resultado['labels'][0]

