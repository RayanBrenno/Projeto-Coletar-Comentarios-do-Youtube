from googleapiclient.discovery import build


def get_code_url(url):
    try:
        video_id = ""
        if "youtube.com/watch?v=" in url:
            video_id = url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            video_id = url.split("/")[-1].split("?")[0]
        else:
            print("❌ Invalid URL format.")
            return None
        if len(video_id) != 11:
            print("❌ Video ID appears to be invalid.")
            return None
        return video_id
    except Exception as e:
        print(f"⚠️ Error processing URL: {e}")
        return None


def get_video_info(video_id):
    api_key = 'AIzaSyBC1f-aU5eUNp_Xx1sfVoTOZKnBtm2uKHI'
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
                'codeURL': video_id,
                'title': video['snippet'].get('title', 'Untitled'),
                'channel': video['snippet'].get('channelTitle', 'Unknown Channel'),
                'publish_date': video['snippet'].get('publishedAt', 'N/A'),
                'views': video['statistics'].get('viewCount', 0),
                'likes': video['statistics'].get('likeCount', 0),
                'comments': video['statistics'].get('commentCount', 0)
            }
            return info
        else:
            print("❌ No video information found.")
            return None

    except Exception as e:
        print("❌ Error retrieving video information. Check the ID or API key.")
        print(f"🔎 Technical details: {e}")
        return None


def get_all_comments(video_id):
    api_key = 'AIzaSyBC1f-aU5eUNp_Xx1sfVoTOZKnBtm2uKHI'
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
                print(f"⚠️ Error requesting comments: {e}")
                break

            for item in response.get('items', []):
                snippet = item['snippet']['topLevelComment']['snippet']
                comments.append({
                    'author': snippet.get('authorDisplayName', 'Anonymous'),
                    'text': snippet.get('textDisplay', ''),
                    'likes': snippet.get('likeCount', 0),
                    'published_at': snippet.get('publishedAt', ''),
                    'felling': 'neutral'
                })

            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break

        return comments

    except Exception as e:
        print(f"❌ General error fetching comments: {e}")
        return []
