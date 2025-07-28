import tkinter as tk
from tkinter import messagebox
from script_banco_de_dadosMongoDB import *
from script_collect_video_info import *

style_text = ("Times New Roman", 13)
background_color = "#f2f2f2"
button_color = "#4a90e2"
button_text_color = "white"


def center_window(window, width, height):
    screen_width = window.winfo_screenwidth()
    screen_height = window.winfo_screenheight()
    x = (screen_width - width) // 2
    y = (screen_height - height) // 2
    window.geometry(f"{width}x{height}+{x}+{y}")


def open_login_window():
    login_window = tk.Tk()
    login_window.title("🔐 Login")
    center_window(login_window, 400, 300)
    login_window.configure(bg=background_color)

    tk.Label(login_window, text="Username:",
             bg=background_color, font=style_text).pack(pady=5)
    entry_username = tk.Entry(login_window, font=style_text)
    entry_username.pack()
    tk.Label(login_window, text="Password:",
             bg=background_color, font=style_text).pack(pady=5)
    entry_password = tk.Entry(login_window, show="*", font=style_text)
    entry_password.pack()

    def try_login():
        username = entry_username.get()
        password = entry_password.get()
        user_id = authenticate_user(username, password)
        if user_id:
            login_window.destroy()
            open_menu_window(user_id)
        else:
            messagebox.showerror("Error", "Invalid username or password.")

    button_frame = tk.Frame(login_window, bg=background_color)
    button_frame.pack(pady=20)

    tk.Button(button_frame, text="Login", width=10, command=try_login, bg=button_color,
              fg=button_text_color, font=style_text).grid(row=0, column=0, padx=5)
    tk.Button(button_frame, text="Register", width=10, command=lambda: (login_window.destroy(
    ), open_register_window()), bg=button_color, fg=button_text_color, font=style_text).grid(row=0, column=1, padx=5)
    tk.Button(login_window, text="Exit Program", width=18, command=login_window.destroy,
              bg=button_color, fg=button_text_color, font=style_text).pack(pady=(0, 10))

    login_window.mainloop()


def open_register_window():
    register_window = tk.Tk()
    register_window.title("📝 Register")
    center_window(register_window, 400, 300)
    register_window.configure(bg=background_color)

    tk.Label(register_window, text="Username:", bg=background_color,
             font=style_text).pack(pady=(10, 2))
    entry_username = tk.Entry(register_window, font=style_text, width=26)
    entry_username.pack()
    tk.Label(register_window, text="Password:", bg=background_color,
             font=style_text).pack(pady=(10, 2))
    entry_password = tk.Entry(
        register_window, show="*", font=style_text, width=26)
    entry_password.pack()
    tk.Label(register_window, text="Confirm Password:",
             bg=background_color, font=style_text).pack(pady=(10, 2))
    entry_confirm_password = tk.Entry(
        register_window, show="*", font=style_text, width=26)
    entry_confirm_password.pack()

    def register():
        username = entry_username.get()
        password = entry_password.get()
        confirm_password = entry_confirm_password.get()

        if not username or not password or not confirm_password:
            messagebox.showwarning("Warning", "Fill in all fields.")
        elif len(username) < 3:
            messagebox.showwarning(
                "Warning", "Username must be at least 3 characters long.")
        elif len(password) < 8 or len(confirm_password) < 8:
            messagebox.showwarning(
                "Warning", "Password must be at least 8 characters long.")
        else:
            if password != confirm_password:
                messagebox.showerror("Error", "Passwords do not match.")
            else:
                success = register_user(username, password)
                if success:
                    messagebox.showinfo(
                        "Success", "User successfully registered!")
                    register_window.destroy()
                    open_login_window()
                else:
                    messagebox.showerror("Error", "User already exists.")

    button_frame = tk.Frame(register_window, bg=background_color)
    button_frame.pack(pady=20)

    btn_register = tk.Button(button_frame, text="Register", width=12,
                             command=register, bg=button_color, fg=button_text_color, font=style_text)
    btn_back = tk.Button(button_frame, text="Back", width=12, command=lambda: [register_window.destroy(
    ), open_login_window()], bg=button_color, fg=button_text_color, font=style_text)
    btn_register.grid(row=0, column=0, padx=5)
    btn_back.grid(row=0, column=1, padx=5)

    register_window.mainloop()


def open_menu_window(user_id):
    menu_window = tk.Tk()
    menu_window.title("📺 Action Menu")
    center_window(menu_window, 400, 220)
    menu_window.configure(bg=background_color)

    tk.Label(menu_window, text="Choose an action:",
             bg=background_color, font=style_text).pack(pady=(20, 10))

    frame_buttons = tk.Frame(menu_window, bg=background_color)
    frame_buttons.pack(pady=10)

    btn_check = tk.Button(frame_buttons, text="Check a new video", width=25, command=lambda: [
                          menu_window.destroy(), open_url_window(user_id)], bg=button_color, fg=button_text_color, font=style_text)
    btn_update = tk.Button(frame_buttons, text="Update video", width=25, command=lambda: [menu_window.destroy(
    ), open_select_update_video_window(user_id)], bg=button_color, fg=button_text_color, font=style_text)
    btn_exit = tk.Button(frame_buttons, text="Logout", width=25, command=lambda: [
                         menu_window.destroy(), open_login_window()], bg=button_color, fg=button_text_color, font=style_text)

    btn_check.pack(pady=5)
    btn_update.pack(pady=5)
    btn_exit.pack(pady=5)

    menu_window.mainloop()


def open_url_window(user_id):
    url_window = tk.Tk()
    url_window.title("🎥 Analyze YouTube Video")
    center_window(url_window, 500, 260)
    url_window.configure(bg=background_color)

    tk.Label(url_window, text="Paste the YouTube video URL:",
             bg=background_color, font=style_text).pack(pady=(20, 10))
    frame_entry = tk.Frame(url_window, bg=background_color)
    frame_entry.pack(padx=40)
    entry_url = tk.Entry(frame_entry, width=50, font=style_text)
    entry_url.pack()

    def check_video():
        code_url = get_code_url(entry_url.get())
        if code_url:
            videos_consulted = take_videos_by_user(user_id)
            for video in videos_consulted:
                if video["codeURL"] == code_url:
                    messagebox.showwarning(
                        "Warning", "This video has already been analyzed, the video will be updated.")
                    url_window.destroy()
                    open_update_video_window(user_id, video)
                    return
            url_window.destroy()
            open_consult_video_window(user_id, code_url)
        else:
            messagebox.showwarning("Warning", "Please enter a valid URL.")

    frame_buttons = tk.Frame(url_window, bg=background_color)
    frame_buttons.pack(pady=(25, 10))
    btn_check = tk.Button(frame_buttons, text="Check", command=check_video,
                          width=12, bg=button_color, fg=button_text_color, font=style_text)
    btn_back = tk.Button(frame_buttons, text="Back", command=lambda: [url_window.destroy(
    ), open_menu_window(user_id)], width=12, bg=button_color, fg=button_text_color, font=style_text)
    btn_check.grid(row=0, column=0, padx=5)
    btn_back.grid(row=0, column=1, padx=5)

    url_window.mainloop()


def open_consult_video_window(user_id, code_url):
    info = get_video_info(code_url)
    comments = get_all_comments(code_url)
    video_manager(info, comments, user_id)

    window = tk.Tk()
    window.title("📄 Video Information")
    center_window(window, 800, 600)
    window.configure(bg=background_color)

    lbl_title = tk.Label(window, text=info["title"], font=(
        style_text[0], 18, "bold"), bg=background_color, wraplength=760, justify="center")
    lbl_title.pack(pady=(15, 5))

    row_info = tk.Frame(window, bg=background_color)
    row_info.pack(pady=5)
    tk.Label(row_info, text=f"Channel: {info['channel']}", bg=background_color, font=style_text).pack(
        side="left", padx=10)
    tk.Label(row_info, text=f"Published on: {info['publish_date']}",
             bg=background_color, font=style_text).pack(side="right", padx=10)

    row_stats = tk.Frame(window, bg=background_color)
    row_stats.pack(pady=5)
    tk.Label(row_stats, text=f"Views: {info['views']}", bg=background_color, font=style_text).pack(
        side="left", padx=10)
    tk.Label(row_stats, text=f"Likes: {info['likes']}", bg=background_color, font=style_text).pack(
        side="left", padx=10)
    tk.Label(row_stats, text=f"Comments: {info['comments']} ({len(comments)})",
             bg=background_color, font=style_text).pack(side="left", padx=10)

    frame_button = tk.Frame(window, bg=background_color)
    frame_button.pack(pady=(10, 5))
    btn_back_menu = tk.Button(frame_button, text="Back to menu", command=lambda: [window.destroy(
    ), open_menu_window(user_id)], bg=button_color, fg=button_text_color, font=style_text)
    btn_back_menu.pack()

    frame_comments = tk.Frame(window)
    frame_comments.pack(fill="both", expand=True, padx=10, pady=10)

    scrollbar_y = tk.Scrollbar(frame_comments)
    scrollbar_y.pack(side="right", fill="y")
    scrollbar_x = tk.Scrollbar(frame_comments, orient="horizontal")
    scrollbar_x.pack(side="bottom", fill="x")

    text_box = tk.Text(frame_comments, wrap="word", font=(
        "Segoe UI", 10), yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)
    text_box.pack(fill="both", expand=True)

    scrollbar_y.config(command=text_box.yview)
    scrollbar_x.config(command=text_box.xview)

    for comment in comments:
        author = comment.get("author", "anonymous")
        text = comment.get("text", "")
        likes = comment.get("likes", 0)
        formatted_line = f"{author} | {text} | Likes -> {likes} \n\n"
        text_box.insert("end", formatted_line)

    text_box.config(state="disabled")


def open_select_update_video_window(user_id):
    videos = take_videos_by_user(user_id)
    window = tk.Tk()
    window.title("🔁 Update Video")
    center_window(window, 1000, 600)
    window.configure(bg=background_color)

    tk.Label(window, text="Select a video to update:",
             font=style_text, bg=background_color).pack(pady=15)

    selected_video = tk.StringVar(value="__none__")

    frame_check = tk.Frame(window, bg=background_color)
    frame_check.pack(padx=20, fill="x")

    for video in videos:
        text = f"{video['title']} — {video['channel']}"
        tk.Radiobutton(frame_check, text=text, variable=selected_video,
                       value=video['idVideo'], bg=background_color, anchor="w", font=style_text).pack(fill="x", pady=2)

    def update_video():
        video_id = selected_video.get()
        if video_id == "__none__":
            messagebox.showwarning(
                "Warning", "Please select a video to update.")
            return
        current_info = None
        for video in videos:
            if video['idVideo'] == video_id:
                current_info = video
                break
        window.destroy()
        open_update_video_window(user_id, current_info)

    frame_buttons = tk.Frame(window, bg=background_color)
    frame_buttons.pack(pady=25)
    btn_update = tk.Button(frame_buttons, text="Update Selected", command=update_video,
                           bg=button_color, fg=button_text_color, font=style_text, width=25)
    btn_update.pack(pady=5)
    btn_back = tk.Button(frame_buttons, text="Back to menu", command=lambda: [window.destroy(
    ), open_menu_window(user_id)], bg=button_color, fg=button_text_color, font=style_text, width=25)
    btn_back.pack(pady=5)

    window.mainloop()


def open_update_video_window(user_id, previous_info):
    info = get_video_info(previous_info["codeURL"])
    comments = get_all_comments(previous_info["codeURL"])
    video_manager(info, comments, user_id)

    window = tk.Tk()
    window.title("📄 Video Information")
    center_window(window, 800, 600)
    window.configure(bg=background_color)

    lbl_title = tk.Label(window, text=info["title"], font=(
        style_text[0], 18, "bold"), bg=background_color, wraplength=760, justify="center")
    lbl_title.pack(pady=(15, 5))

    row_info = tk.Frame(window, bg=background_color)
    row_info.pack(pady=5)
    tk.Label(row_info, text=f"Channel: {info['channel']}", bg=background_color, font=style_text).pack(
        side="left", padx=10)
    tk.Label(row_info, text=f"Published on: {info['publish_date']}",
             bg=background_color, font=style_text).pack(side="right", padx=10)

    row_stats = tk.Frame(window, bg=background_color)
    row_stats.pack(pady=5)
    tk.Label(row_stats, text=f"Views: {info['views']} (+{int(info['views']) - int(previous_info['views'])})",
             bg=background_color, font=style_text).pack(side="left", padx=10)
    tk.Label(row_stats, text=f"Likes: {info['likes']} (+{int(info['likes']) - int(previous_info['likes'])})",
             bg=background_color, font=style_text).pack(side="left", padx=10)
    tk.Label(row_stats, text=f"Comments: {info['comments']} (+{int(info['comments']) - int(previous_info['comments'])}) ({len(comments)})",
             bg=background_color, font=style_text).pack(side="left", padx=10)

    frame_button = tk.Frame(window, bg=background_color)
    frame_button.pack(pady=(10, 5))
    btn_back_menu = tk.Button(frame_button, text="Back to menu", command=lambda: [window.destroy(
    ), open_menu_window(user_id)], bg=button_color, fg=button_text_color, font=style_text)
    btn_back_menu.pack()

    frame_comments = tk.Frame(window)
    frame_comments.pack(fill="both", expand=True, padx=10, pady=10)

    scrollbar_y = tk.Scrollbar(frame_comments)
    scrollbar_y.pack(side="right", fill="y")
    scrollbar_x = tk.Scrollbar(frame_comments, orient="horizontal")
    scrollbar_x.pack(side="bottom", fill="x")

    text_box = tk.Text(frame_comments, wrap="word", font=(
        "Segoe UI", 10), yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)
    text_box.pack(fill="both", expand=True)

    scrollbar_y.config(command=text_box.yview)
    scrollbar_x.config(command=text_box.xview)

    for comment in comments:
        author = comment.get("author", "anonymous")
        text = comment.get("text", "")
        likes = comment.get("likes", 0)
        formatted_line = f"{author} | {text} | Likes -> {likes} \n\n"
        text_box.insert("end", formatted_line)

    text_box.config(state="disabled")
