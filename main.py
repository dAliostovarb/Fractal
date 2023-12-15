import tkinter
from tkinter import *
from tkinter import ttk

window = Tk()

# ----------------/ Menu \----------------

menubar = Menu(window)

file_menu = Menu(menubar, tearoff=0)
file_menu.add_command(label='باز کردن فایل')
file_menu.add_command(label='ذخیره')
file_menu.add_command(label='ذخیره کردن به عنوان فایل جدید')
file_menu.add_command(label='بستن')
menubar.add_cascade(label='فایل', menu=file_menu)

settings_menu = Menu(menubar, tearoff=0)
settings_menu.add_command(label='تغییر رنگ پس زمینه')
settings_menu.add_command(label='تغییر رنگ متن')
menubar.add_cascade(label='تنظیمات', menu=settings_menu)

help_menu = Menu(menubar, tearoff=0)
help_menu.add_command(label='کمک')
help_menu.add_command(label='آموزش')
help_menu.add_command(label='درباره ما')
menubar.add_cascade(label='کمک ها', menu=help_menu)

# ----------------/ Frame \----------------
header_frame = Frame(window, bg='yellow', width=720, height=50)
header_frame.pack(side=TOP)
sidebar_frame = Frame(window, bg='red', width=200, height=412)
sidebar_frame.pack(side=LEFT)
main_body = Frame(window, bg='blue', width=520, height=412)
main_body.pack(side=RIGHT)

# ----------------/ Button \----------------

tree = ttk.Treeview(window, columns=("A1", "A2", "A3"), show='headings')
tree.column(0, anchor=tkinter.CENTER)
tree.heading(0, text='ID')
tree.column(1, anchor=tkinter.CENTER)
tree.heading(1, text='ID2')
tree.column(2, anchor=tkinter.CENTER)
tree.heading(2, text='ID3')
tree.insert("",index=tkinter.END, values=('a','b'))
tree.insert("",index=tkinter.END, values=('a','b'))
tree.insert("",index=tkinter.END, values=('a','b'))
tree.pack()

window.configure(bg='#262626', width=720, height=512, menu=menubar)
window.mainloop()
