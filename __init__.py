"""
Alber-ComfyUI-TextNote
文本备注节点：左侧编辑内容，右侧切换备注列表，支持自定义字体与字号缩放。

Repository: https://github.com/Alber-Alber/Alber-ComfyUI-TextNote
License: MIT
"""

from .nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

__version__ = "1.0.0"

WEB_DIRECTORY = "./web"

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
    "WEB_DIRECTORY",
    "__version__",
]
