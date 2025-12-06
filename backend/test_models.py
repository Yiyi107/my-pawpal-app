import google.generativeai as genai
import os

# --- 必须替换成你的 Key ---
GOOGLE_API_KEY = "AIzaSyBGBqs7PEY-Y84S3oMWdcBJJC1R_F-po34"
genai.configure(api_key=GOOGLE_API_KEY)

print("正在尝试连接 Google 服务器查询可用模型...")

try:
    # 列出所有支持 generateContent 的模型
    print("------------------------------------------------")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"可用模型: {m.name}")
    print("------------------------------------------------")
except Exception as e:
    print(f"发生错误: {e}")