from googleapiclient.discovery import build
from scriptBancoConexao import gerenciador_video

def get_video_id():
    try:
        url = input("🔗 Digite a URL do vídeo: ").strip()
        if not url:
            print("⚠️  URL vazia.")
            return None
        
        if "youtube.com/watch?v=" in url:
            video_id = url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            video_id = url.split("/")[-1].split("?")[0]
        else:
            print("❌ Formato de URL inválido.")
            return None

        if len(video_id) != 11:
            print("❌ ID do vídeo aparentemente inválido.")
            return None
        
        print(f"✅ ID do vídeo extraído: {video_id}")
        return video_id
    except Exception as e:
        print(f"⚠️  Erro ao processar a URL: {e}")
        return None


def get_video_info(video_id, api_key):
    try:
        youtube = build("youtube", "v3", developerKey=api_key)
        request = youtube.videos().list(
            part='snippet,statistics',
            id=video_id
        )
        response = request.execute()

        if 'items' in response and len(response['items']) > 0:
            video = response['items'][0]
            info = {
                'idVideo': video_id,
                'title': video['snippet'].get('title', 'Sem título'),
                'channel': video['snippet'].get('channelTitle', 'Canal desconhecido'),
                'publish_date': video['snippet'].get('publishedAt', 'Data não disponível'),
                'views': video['statistics'].get('viewCount', 0),
                'likes': video['statistics'].get('likeCount', 0),
                'comments': video['statistics'].get('commentCount', 0)
            }
            print(f"✅ Informações do vídeo '{info['title']}' obtidas com sucesso.")
            return info
        else:
            print("❌ Nenhuma informação encontrada para o vídeo.")
            return None

    except Exception as e:
        print("❌ Erro ao buscar informações do vídeo. Verifique o ID ou a chave da API.")
        print(f"🔎 Detalhes técnicos: {e}")
        return None


def get_all_comments(video_id, api_key):
    try:
        youtube = build("youtube", "v3", developerKey=api_key)
        comments = []
        next_page_token = None

        while True:
            try:
                request = youtube.commentThreads().list(
                    part="snippet",
                    videoId=video_id,
                    maxResults=100,
                    pageToken=next_page_token,
                    textFormat="plainText",
                    order="time"
                )
                response = request.execute()
            except Exception as e:
                print(f"⚠️ Erro ao requisitar comentários: {e}")
                break

            for item in response.get('items', []):
                snippet = item['snippet']['topLevelComment']['snippet']
                comments.append({
                    'idVideo': video_id,
                    'author': snippet.get('authorDisplayName', 'Anônimo'),
                    'text': snippet.get('textDisplay', ''),
                    'likes': snippet.get('likeCount', 0),
                    'published_at': snippet.get('publishedAt', ''),
                    'felling': 'neutro'
                })

            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break

        print(f"✅ Obtidos {len(comments)} comentários.")
        return comments

    except Exception as e:
        print(f"❌ Erro geral ao obter comentários: {e}")
        return []

    
API_KEY = 'AIzaSyBC1f-aU5eUNp_Xx1sfVoTOZKnBtm2uKHI' 


def collectDate():
    video_id = get_video_id()
    if not video_id:
        print("❌ Coleta de dados cancelada devido a erro no ID do vídeo.")
        return
    info = get_video_info(video_id, API_KEY)
    comments = get_all_comments(video_id, API_KEY)
    gerenciador_video(info, comments)
    
    
collectDate()