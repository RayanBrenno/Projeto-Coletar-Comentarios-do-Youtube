import textwrap
import pandas as pd
import matplotlib.pyplot as plt
from tkinter import messagebox
from script_banco_de_dadosMongoDB import take_comments_by_video_id


def generate_graphs_for_video(video_info):
    video_id = video_info["idVideo"]
    title = video_info.get("title", "Video")

    comments = take_comments_by_video_id(video_id)
    if not comments:
        messagebox.showwarning("Warning", "No comments found for this video.")
        return

    df = pd.DataFrame(comments)

    # Garantir colunas
    for col in ["sentiment", "intention", "likes", "published_at"]:
        if col not in df.columns:
            df[col] = None

    df["likes"] = pd.to_numeric(df["likes"], errors="coerce").fillna(0).astype(int)
    df["published_at"] = pd.to_datetime(df["published_at"], errors="coerce", utc=True)
    df = df.dropna(subset=["published_at"]).copy()
    if df.empty:
        messagebox.showwarning("Warning", "No valid dates found in comments.")
        return

    wrapped_title = "\n".join(textwrap.wrap(title, width=60))

    # =========================
    # DASHBOARD (1 janela)
    # =========================
    fig, axes = plt.subplots(1, 3, figsize=(16, 5))
    fig.suptitle(wrapped_title, fontsize=10)

    # =========================
    # 1) Sentiment (English)
    # =========================
    sentiment_counts = df["sentiment"].fillna("Unknown").value_counts()

    sentiment_labels = ["Positive", "Negative", "Neutral"]
    sentiment_values = [
        sentiment_counts.get("Positive", 0),
        sentiment_counts.get("Negative", 0),
        sentiment_counts.get("Neutral", 0)
    ]

    sentiment_colors = ["green", "red", "yellow"]

    wedges1, _, _ = axes[0].pie(
        sentiment_values,
        colors=sentiment_colors,
        autopct="%1.1f%%",
        startangle=90
    )

    axes[0].set_title("Sentiment")
    axes[0].axis("equal")

    axes[0].legend(
        wedges1,
        sentiment_labels,
        loc="upper center",
        bbox_to_anchor=(0.5, -0.05),
        ncol=3
    )

    # =========================
    # 2) Intention (English)
    # =========================
    intention_counts = df["intention"].fillna("Other").value_counts()

    intention_labels = ["Praise", "Criticism", "Information", "Question", "Other"]
    intention_values = [
        intention_counts.get("Praise", 0),
        intention_counts.get("Criticism", 0),
        intention_counts.get("Information", 0),
        intention_counts.get("Question", 0),
        intention_counts.get("Other", 0)
    ]

    wedges2, _, _ = axes[1].pie(
        intention_values,
        autopct="%1.1f%%",
        startangle=90
    )

    axes[1].set_title("Intention")
    axes[1].axis("equal")

    axes[1].legend(
        wedges2,
        intention_labels,
        loc="upper center",
        bbox_to_anchor=(0.5, -0.05),
        ncol=3
    )

    # =========================
    # 3) Comments per Day (Linha)
    # =========================
    df_daily = df.copy()
    df_daily["date"] = df_daily["published_at"].dt.date
    counts_by_day = df_daily.groupby("date").size().sort_index()

    axes[2].plot(counts_by_day.index, counts_by_day.values)
    axes[2].set_title("Comments per Day")
    axes[2].set_xlabel("Date")
    axes[2].set_ylabel("Count")

    for label in axes[2].get_xticklabels():
        label.set_rotation(45)

    plt.tight_layout()
    plt.show()