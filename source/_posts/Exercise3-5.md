---
title: Exercise3.5--封装图片操作
date: 2019-03-21 17:24:57
tags:
- 图像处理
---

三个练习过后，我感觉，最基础的图片操作，载入，写出，画直方图这些操作千篇一律，是时候将他们封装在一起了

<!-- more -->

封装的东西大致分为两类，图片的加载与输出以及直方图的建立与输出。

## 基本类型
```cpp
//图片的信息
typedef struct ImageData
{
	BITMAPFILEHEADER fileHeader;
	BITMAPINFOHEADER infoHeader;
	RGBQUAD rgbquad[256];
	BYTE * pImg;
	int length;
	int width, height;
}IMGDATA;

//直方图的信息
typedef struct GrayHistogram
{
	double gray[256] = { 0 };
	int pixelCount = 0;
	void normalize();

private:
	bool isNormalize = false;
}GRAYHISTOGRAM;

```
## 读写操作
在这里，我将读写操作从[Exercise1](/2019/03/20/BMP文件处理/)当中的fwrite，fread改为了cpp当中的iofstream，个人感觉更加方便
```cpp
//读取图片
ImageData ImageUtil::loadImage(const std::string& path)
{
	std::ifstream ifstream;
	ifstream.open(path, std::ios::binary);
	if (!ifstream.is_open())
		return {};

	BITMAPFILEHEADER fileHeader;
	BITMAPINFOHEADER infoHeader;
	RGBQUAD rgbquad[256];

	ifstream.read(reinterpret_cast<char *>(&fileHeader), sizeof(BITMAPFILEHEADER));
	ifstream.read(reinterpret_cast<char *>(&infoHeader), sizeof(BITMAPINFOHEADER));
	ifstream.read(reinterpret_cast<char *>(&rgbquad), sizeof(RGBQUAD) * infoHeader.biClrUsed);

	BYTE *img = new BYTE[infoHeader.biSizeImage];
	ifstream.read(reinterpret_cast<char*>(img), infoHeader.biSizeImage);

	IMGDATA imgdate;
	imgdate.infoHeader = infoHeader;
	imgdate.fileHeader = fileHeader;
	for (int i = 0; i < 256; i++)
	{
		imgdate.rgbquad[i] = rgbquad[i];
	}

	BYTE *imgWithoutError = new BYTE[(infoHeader.biWidth * infoHeader.biBitCount / 8) * infoHeader.biHeight];
	//int byteWidth = (infoHeader.biWidth * (infoHeader.biClrUsed / 8) + 3) / 4 * 4;
	int point = -1;
	for(int i = 0;i < infoHeader.biHeight;i++)
	{
		for(int j = 0;j < (infoHeader.biWidth * infoHeader.biBitCount / 8);j++)
		{
			imgWithoutError[i * (infoHeader.biWidth * infoHeader.biBitCount / 8) + j] = img[++point];
		}

		while (point % 4 != 0)
			point++;
	}

	delete[] img;

	imgdate.pImg = imgWithoutError;
	imgdate.length = infoHeader.biSizeImage;
	imgdate.width = infoHeader.biWidth;
	imgdate.height = infoHeader.biHeight;

	
	ifstream.close();
	return imgdate;
}

//输出图片
void ImageUtil::outputImage(ImageData data, const int clrUsed, const std::string& path)
{
	std::ofstream out;
	out.open(path, std::ios::out | std::ios::trunc | std::ios::binary);
	if (!out.is_open())
		return;	

	BYTE *img = new BYTE[data.length];
	int byteWidth = (infoHeader.biWidth * infoHeader.biBitCount / 8);
	int point = -1;
	for(int i = 0;i < data.height;i++)
	{
		for(int j = 0;j < byteWidth;j++)
		{
			img[++point] = data.pImg[i * data.width + j];
		}

		while (point % 4 != 0)
			img[++point] = 0;
	}

	std::cout << "output " << path << "...." << std::endl;
	out.write(reinterpret_cast<char *>(&data.fileHeader), sizeof(BITMAPFILEHEADER));
	out.write(reinterpret_cast<char *>(&data.infoHeader), sizeof(BITMAPINFOHEADER));
	out.write(reinterpret_cast<char *>(&data.rgbquad), clrUsed * sizeof(RGBQUAD));
	out.write(reinterpret_cast<char *>(img), data.length);
	out.close();

	
}

//得到图片的直方图信息
GRAYHISTOGRAM ImageUtil::getHistogram(const IMGDATA data)
{
	GRAYHISTOGRAM grayhistogram;
	int point = 0;
	for (int i = 0; i < data.height; i++)
	{
		for (int j = 0; j < data.width; j++)
		{
			grayhistogram.gray[data.pImg[point++]]++;
		}

		while (point % 4 != 0)
			point++;
	}

	grayhistogram.pixelCount = data.width * data.height;
	return grayhistogram;
}

//输出直方图
void ImageUtil::outputHistogram(const IMGDATA data, const std::string& path)
{
	IMGDATA newData = data;
	GRAYHISTOGRAM histogram = ImageUtil::getHistogram(data);

	// newData.fileHeader.bfType = 0x4d42;
	// newData.fileHeader.bfReserved1 = 0;
	// newData.fileHeader.bfReserved2 = 0;
	newData.fileHeader.bfSize = sizeof(BITMAPINFOHEADER) + sizeof(BITMAPINFOHEADER) + sizeof(RGBQUAD) * 2 + 256 * 256;
	newData.fileHeader.bfOffBits = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + sizeof(RGBQUAD) * 2;
	//
	   // newData.infoHeader.biSize = sizeof(BITMAPINFOHEADER);
	   // newData.infoHeader.biPlanes = 1;
	newData.infoHeader.biBitCount = 8;
	newData.infoHeader.biClrUsed = 2;
	//newData.infoHeader.biCompression = BI_RGB;
	newData.infoHeader.biSizeImage = 256 * 256;
	newData.infoHeader.biHeight = 256;
	newData.infoHeader.biWidth = 256;
	// newData.infoHeader.biClrImportant = data.infoHeader.biClrImportant;
	// newData.infoHeader.biXPelsPerMeter = data.infoHeader.biXPelsPerMeter;
	// newData.infoHeader.biYPelsPerMeter = data.infoHeader.biYPelsPerMeter;

	newData.pImg = new BYTE[256 * 256];

	histogram.normalize();

	RGBQUAD white;
	white.rgbReserved = 0;
	white.rgbRed = 255;
	white.rgbBlue = 255;
	white.rgbGreen = 255;

	RGBQUAD black;
	black.rgbReserved = 0;
	black.rgbRed = 0;
	black.rgbBlue = 0;
	black.rgbGreen = 0;

	newData.rgbquad[0] = black;
	newData.rgbquad[1] = white;

	for (int i = 0; i < 256; i++)
	{
		int length = histogram.gray[i] * 255 * 20;
		if (length > 255)
			length = 255;
		for (int j = 0; j < length; j++)
		{
			newData.pImg[j * 256 + i] = 1;
		}
	}

	newData.length = 256 * 256;
	newData.width = 256;
	newData.height = 256;

	outputImage(newData, 2, path);
}
```

由于和之前[Exercise1](/2019/03/20/BMP文件处理/)与[Exercise2](/2019/03/21/直方图处理/)的操作是一样的，因此也就不再赘述了。