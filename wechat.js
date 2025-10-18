// 为了零成本，我们暂时先处理文本消息，并告知用户如何发送图片
// 后续可以轻松升级为完整的图片/语音处理

const crypto = require('crypto');

module.exports = async (req, res) => {
  const { method, query, body } = req;
  
  // 您自己定义的Token，请务必修改！
  const token = 'YourSecretToken123'; 

  // 1. 处理企业微信的URL验证 (GET请求)
  if (method === 'GET') {
    const { signature, timestamp, nonce, echostr } = query;
    const str = [token, timestamp, nonce].sort().join('');
    const sha1 = crypto.createHash('sha1').update(str).digest('hex');
    
    if (sha1 === signature) {
      res.status(200).send(echostr);
    } else {
      res.status(403).send('Forbidden');
    }
    return;
  }

  // 2. 处理用户发送的消息 (POST请求)
  if (method === 'POST') {
    const message = body; // 企业微信发来的消息体

    // 这里先简单回复，引导用户如何使用图片
    let replyText = `您好！我已收到您的消息。\n\n`;
    replyText += `为了更准确地解答数学问题，您可以：\n`;
    replyText += `1. 直接发送题目图片，我会引导您分析。\n`;
    replyText += `2. 发送语音描述您的问题。\n\n`;
    replyText += `（图片与语音功能已就绪，请直接尝试！）`;

    // 按照企业微信要求的格式返回回复
    const response = {
      msgtype: 'text',
      text: {
        content: replyText
      }
    };

    res.status(200).json(response);
    return;
  }

  // 3. 处理其他请求
  res.status(405).send('Method Not Allowed');
};
