export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  subject: string
  grade: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const questionBank: Record<string, Question[]> = {
  // ============================
  // 📘 TOÁN HỌC - 50 câu
  // ============================
  math: [
    // Dễ (Lớp 1-2)
    { id: 1, question: '1 + 1 = ?', options: ['1', '2', '3', '4'], correctAnswer: '2', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 2, question: '2 + 2 = ?', options: ['3', '4', '5', '6'], correctAnswer: '4', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 3, question: '3 + 3 = ?', options: ['5', '6', '7', '8'], correctAnswer: '6', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 4, question: '4 + 4 = ?', options: ['7', '8', '9', '10'], correctAnswer: '8', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 5, question: '5 + 5 = ?', options: ['9', '10', '11', '12'], correctAnswer: '10', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 6, question: '10 - 3 = ?', options: ['5', '6', '7', '8'], correctAnswer: '7', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 7, question: '8 - 5 = ?', options: ['2', '3', '4', '5'], correctAnswer: '3', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 8, question: '6 + 4 = ?', options: ['8', '9', '10', '11'], correctAnswer: '10', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 9, question: '9 - 2 = ?', options: ['5', '6', '7', '8'], correctAnswer: '7', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 10, question: '3 + 5 = ?', options: ['7', '8', '9', '10'], correctAnswer: '8', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 11, question: 'Số lớn nhất trong các số: 5, 8, 3, 9 là?', options: ['5', '8', '3', '9'], correctAnswer: '9', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 12, question: 'Số bé nhất trong các số: 4, 7, 2, 6 là?', options: ['4', '7', '2', '6'], correctAnswer: '2', subject: 'Toán học', grade: '1', difficulty: 'easy' },
    { id: 13, question: '2 + 3 + 4 = ?', options: ['7', '8', '9', '10'], correctAnswer: '9', subject: 'Toán học', grade: '2', difficulty: 'easy' },
    { id: 14, question: '5 + 5 + 5 = ?', options: ['12', '13', '14', '15'], correctAnswer: '15', subject: 'Toán học', grade: '2', difficulty: 'easy' },
    { id: 15, question: '20 - 10 = ?', options: ['8', '9', '10', '11'], correctAnswer: '10', subject: 'Toán học', grade: '2', difficulty: 'easy' },
    
    // Trung bình (Lớp 2-3)
    { id: 16, question: '12 + 15 = ?', options: ['25', '26', '27', '28'], correctAnswer: '27', subject: 'Toán học', grade: '2', difficulty: 'medium' },
    { id: 17, question: '34 - 18 = ?', options: ['14', '15', '16', '17'], correctAnswer: '16', subject: 'Toán học', grade: '2', difficulty: 'medium' },
    { id: 18, question: '3 × 4 = ?', options: ['10', '11', '12', '13'], correctAnswer: '12', subject: 'Toán học', grade: '2', difficulty: 'medium' },
    { id: 19, question: '15 ÷ 3 = ?', options: ['3', '4', '5', '6'], correctAnswer: '5', subject: 'Toán học', grade: '2', difficulty: 'medium' },
    { id: 20, question: '7 × 6 = ?', options: ['40', '42', '44', '46'], correctAnswer: '42', subject: 'Toán học', grade: '2', difficulty: 'medium' },
    { id: 21, question: '56 ÷ 7 = ?', options: ['7', '8', '9', '10'], correctAnswer: '8', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 22, question: '45 + 38 = ?', options: ['80', '81', '82', '83'], correctAnswer: '83', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 23, question: '92 - 47 = ?', options: ['43', '44', '45', '46'], correctAnswer: '45', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 24, question: '8 × 9 = ?', options: ['70', '72', '74', '76'], correctAnswer: '72', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 25, question: '144 ÷ 12 = ?', options: ['10', '11', '12', '13'], correctAnswer: '12', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 26, question: '23 × 4 = ?', options: ['88', '90', '92', '94'], correctAnswer: '92', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 27, question: '168 ÷ 7 = ?', options: ['22', '23', '24', '25'], correctAnswer: '24', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 28, question: '135 + 279 = ?', options: ['404', '414', '424', '434'], correctAnswer: '414', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 29, question: 'Số nào là số chẵn trong các số: 23, 36, 45, 57?', options: ['23', '36', '45', '57'], correctAnswer: '36', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    { id: 30, question: 'Số nào chia hết cho 3 trong các số: 14, 22, 27, 35?', options: ['14', '22', '27', '35'], correctAnswer: '27', subject: 'Toán học', grade: '3', difficulty: 'medium' },
    
    // Khó (Lớp 4-5)
    { id: 31, question: '234 + 567 = ?', options: ['791', '801', '811', '821'], correctAnswer: '801', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 32, question: '845 - 398 = ?', options: ['437', '447', '457', '467'], correctAnswer: '447', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 33, question: '67 × 89 = ?', options: ['5963', '5964', '5965', '5966'], correctAnswer: '5963', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 34, question: '1344 ÷ 16 = ?', options: ['82', '83', '84', '85'], correctAnswer: '84', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 35, question: '2/3 + 1/4 = ?', options: ['10/12', '11/12', '12/12', '13/12'], correctAnswer: '11/12', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 36, question: '3/4 - 1/2 = ?', options: ['1/4', '2/4', '3/4', '4/4'], correctAnswer: '1/4', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 37, question: '0.75 + 0.25 = ?', options: ['0.9', '1.0', '1.1', '1.2'], correctAnswer: '1.0', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 38, question: '12.5 - 4.3 = ?', options: ['8.0', '8.1', '8.2', '8.3'], correctAnswer: '8.2', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 39, question: '235 × 187 = ?', options: ['43945', '43955', '43965', '43975'], correctAnswer: '43945', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 40, question: '4578 ÷ 6 = ?', options: ['760', '761', '762', '763'], correctAnswer: '763', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 41, question: '25% của 200 là bao nhiêu?', options: ['40', '50', '60', '70'], correctAnswer: '50', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 42, question: '15% của 300 là bao nhiêu?', options: ['43', '44', '45', '46'], correctAnswer: '45', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 43, question: 'Số nào là số nguyên tố trong các số: 29, 33, 39, 45?', options: ['29', '33', '39', '45'], correctAnswer: '29', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 44, question: 'Số nào là hợp số trong các số: 31, 37, 41, 49?', options: ['31', '37', '41', '49'], correctAnswer: '49', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 45, question: '4³ = ? (4 mũ 3)', options: ['48', '56', '64', '72'], correctAnswer: '64', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 46, question: '√144 = ? (căn bậc hai của 144)', options: ['10', '11', '12', '13'], correctAnswer: '12', subject: 'Toán học', grade: '5', difficulty: 'hard' },
    { id: 47, question: 'Số La Mã XIX là số bao nhiêu?', options: ['17', '18', '19', '20'], correctAnswer: '19', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 48, question: 'Tổng các số từ 1 đến 10 là?', options: ['45', '50', '55', '60'], correctAnswer: '55', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 49, question: 'Chu vi hình vuông có cạnh 6cm là?', options: ['20cm', '22cm', '24cm', '26cm'], correctAnswer: '24cm', subject: 'Toán học', grade: '4', difficulty: 'hard' },
    { id: 50, question: 'Diện tích hình chữ nhật có chiều dài 8cm, chiều rộng 5cm là?', options: ['38cm²', '39cm²', '40cm²', '41cm²'], correctAnswer: '40cm²', subject: 'Toán học', grade: '4', difficulty: 'hard' },
  ],

  // ============================
  // 📗 TIẾNG VIỆT - 50 câu
  // ============================
  vietnamese: [
    // Dễ (Lớp 1-2)
    { id: 101, question: 'Từ nào chỉ đồ vật trong nhà?', options: ['cây', 'bàn', 'hoa', 'mây'], correctAnswer: 'bàn', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 102, question: 'Từ nào viết đúng chính tả?', options: ['cây xanh', 'cây xang', 'cây xênh', 'cây xình'], correctAnswer: 'cây xanh', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 103, question: 'Tiếng nào có vần "am"?', options: ['nam', 'năm', 'nấm', 'nằm'], correctAnswer: 'nam', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 104, question: 'Từ nào chỉ loài vật?', options: ['cây', 'hoa', 'mèo', 'lúa'], correctAnswer: 'mèo', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 105, question: 'Dấu hỏi trong từ nào dưới đây?', options: ['bàn', 'ghế', 'tủ', 'cửa'], correctAnswer: 'cửa', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 106, question: 'Từ nào là từ chỉ hoạt động?', options: ['chạy', 'vui', 'đẹp', 'hiền'], correctAnswer: 'chạy', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 107, question: 'Từ nào là từ chỉ màu sắc?', options: ['xanh', 'nước', 'cây', 'nhà'], correctAnswer: 'xanh', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 108, question: 'Tiếng nào có dấu sắc?', options: ['lúa', 'bò', 'cỏ', 'mưa'], correctAnswer: 'lúa', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 109, question: 'Từ nào viết đúng chính tả với vần "ao"?', options: ['bão', 'báo', 'bào', 'bạo'], correctAnswer: 'báo', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 110, question: 'Từ nào có nghĩa trái ngược với "vui"?', options: ['buồn', 'giận', 'tức', 'sợ'], correctAnswer: 'buồn', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 111, question: 'Từ nào là từ chỉ tình cảm?', options: ['yêu', 'ăn', 'ngủ', 'chạy'], correctAnswer: 'yêu', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 112, question: 'Tiếng nào có vần "ê"?', options: ['cây', 'che', 'cho', 'chu'], correctAnswer: 'che', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 113, question: 'Từ nào có dấu ngã?', options: ['cõng', 'cống', 'cong', 'con'], correctAnswer: 'cõng', subject: 'Tiếng Việt', grade: '1', difficulty: 'easy' },
    { id: 114, question: 'Từ nào chỉ nghề nghiệp?', options: ['bác sĩ', 'cây', 'hoa', 'mặt trời'], correctAnswer: 'bác sĩ', subject: 'Tiếng Việt', grade: '2', difficulty: 'easy' },
    { id: 115, question: 'Từ nào viết đúng chính tả?', options: ['công việc', 'công vẹc', 'công vệc', 'công viếc'], correctAnswer: 'công việc', subject: 'Tiếng Việt', grade: '2', difficulty: 'easy' },
    
    // Trung bình (Lớp 2-3)
    { id: 116, question: 'Câu nào có từ ngữ chỉ sự vật?', options: ['Cây xanh tốt.', 'Em yêu mẹ.', 'Chú chim hót.', 'Trời đẹp quá!'], correctAnswer: 'Cây xanh tốt.', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 117, question: 'Từ nào là từ láy?', options: ['xanh xanh', 'xanh lá', 'xanh biếc', 'xanh đen'], correctAnswer: 'xanh xanh', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 118, question: 'Từ trái nghĩa với "nóng" là gì?', options: ['lạnh', 'ấm', 'mát', 'rét'], correctAnswer: 'lạnh', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 119, question: 'Từ nào là từ ghép?', options: ['ăn học', 'ăn', 'học', 'vui'], correctAnswer: 'ăn học', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 120, question: 'Câu nào là câu hỏi?', options: ['Bạn đi đâu?', 'Bạn đi học.', 'Bạn vui quá!', 'Bạn hãy đi.'], correctAnswer: 'Bạn đi đâu?', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 121, question: 'Từ nào viết sai chính tả?', options: ['nước non', 'nuớc non', 'nước nọn', 'nược non'], correctAnswer: 'nuớc non', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 122, question: 'Từ nào đồng nghĩa với "to" là?', options: ['lớn', 'bé', 'nhỏ', 'cao'], correctAnswer: 'lớn', subject: 'Tiếng Việt', grade: '2', difficulty: 'medium' },
    { id: 123, question: 'Từ nào chỉ phẩm chất tốt đẹp?', options: ['thông minh', 'cao', 'nhanh', 'chạy'], correctAnswer: 'thông minh', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 124, question: 'Cụm từ "đi học" thuộc loại từ gì?', options: ['động từ', 'danh từ', 'tính từ', 'đại từ'], correctAnswer: 'động từ', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 125, question: 'Câu nào là câu kể?', options: ['Bạn có thích học không?', 'Hãy học giỏi!', 'Bạn là học sinh giỏi.', 'Trời ơi, đẹp quá!'], correctAnswer: 'Bạn là học sinh giỏi.', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 126, question: 'Từ nào có vần "ưu"?', options: ['cứu', 'cơu', 'cầu', 'câu'], correctAnswer: 'cứu', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 127, question: 'Từ nào viết đúng chính tả?', options: ['khôn khéo', 'khôn khéo', 'khôn khẻo', 'khôn khẽo'], correctAnswer: 'khôn khéo', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 128, question: 'Từ trái nghĩa với "đẹp" là?', options: ['xấu', 'ngu', 'chậm', 'thấp'], correctAnswer: 'xấu', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 129, question: 'Từ nào đồng nghĩa với "chăm chỉ"?', options: ['siêng năng', 'lười biếng', 'nhanh nhẹn', 'thông minh'], correctAnswer: 'siêng năng', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    { id: 130, question: 'Câu nào có dấu phẩy dùng đúng?', options: ['Hôm nay, trời đẹp.', 'Hôm nay trời, đẹp.', 'Hôm nay trời đẹp,.', ',Hôm nay trời đẹp.'], correctAnswer: 'Hôm nay, trời đẹp.', subject: 'Tiếng Việt', grade: '3', difficulty: 'medium' },
    
    // Khó (Lớp 4-5)
    { id: 131, question: 'Từ nào là từ Hán Việt?', options: ['quốc kỳ', 'cờ', 'lá', 'hoa'], correctAnswer: 'quốc kỳ', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 132, question: 'Câu nào là câu ghép?', options: ['Trời mưa, đường trơn.', 'Trời mưa.', 'Đường trơn.', 'Mưa to quá!'], correctAnswer: 'Trời mưa, đường trơn.', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 133, question: 'Từ nào là từ tượng hình?', options: ['lấp lánh', 'xanh xanh', 'đỏ đỏ', 'vàng hoe'], correctAnswer: 'lấp lánh', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 134, question: 'Thành ngữ nào có nghĩa "học không nghỉ"?', options: ['Học một biết mười', 'Học thầy không tày học bạn', 'Học ngày không phí', 'Học phải đi đôi với hành'], correctAnswer: 'Học ngày không phí', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 135, question: 'Từ nào viết đúng chính tả?', options: ['kỷ niệm', 'kỹ niệm', 'kỉ niệm', 'kĩ niệm'], correctAnswer: 'kỷ niệm', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 136, question: 'Tác phẩm "Truyện Kiều" của tác giả nào?', options: ['Nguyễn Du', 'Nguyễn Trãi', 'Nguyễn Đình Chiểu', 'Hồ Xuân Hương'], correctAnswer: 'Nguyễn Du', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 137, question: 'Từ nào là danh từ?', options: ['cây cối', 'xanh tươi', 'mát mẻ', 'vui vẻ'], correctAnswer: 'cây cối', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 138, question: 'Câu nào là câu cảm?', options: ['Ôi, đẹp quá!', 'Bạn đi đâu?', 'Trời đẹp.', 'Hãy học bài đi.'], correctAnswer: 'Ôi, đẹp quá!', subject: 'Tiếng Việt', grade: '4', difficulty: 'hard' },
    { id: 139, question: 'Từ nào có vần "iêu"?', options: ['chiều', 'cheo', 'chao', 'chau'], correctAnswer: 'chiều', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 140, question: 'Từ nào trái nghĩa với "anh hùng"?', options: ['hèn nhát', 'dũng cảm', 'gan dạ', 'kiên cường'], correctAnswer: 'hèn nhát', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 141, question: 'Từ nào đồng nghĩa với "bình minh"?', options: ['rạng đông', 'hoàng hôn', 'trưa', 'đêm'], correctAnswer: 'rạng đông', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 142, question: 'Từ nào là từ láy?', options: ['lung linh', 'xanh lá', 'đỏ tươi', 'vàng hoe'], correctAnswer: 'lung linh', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 143, question: 'Câu nào có thành ngữ?', options: ['Có chí thì nên', 'Nên học', 'Học giỏi', 'Siêng năng'], correctAnswer: 'Có chí thì nên', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 144, question: 'Từ nào viết sai chính tả?', options: ['xinh xắn', 'sinh xắn', 'xinh sắn', 'sinh sắn'], correctAnswer: 'sinh xắn', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 145, question: 'Tác phẩm nào là của nhà văn Nguyễn Đình Chiểu?', options: ['Lục Vân Tiên', 'Truyện Kiều', 'Bình Ngô đại cáo', 'Nhật ký trong tù'], correctAnswer: 'Lục Vân Tiên', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 146, question: 'Từ nào là đại từ?', options: ['tôi', 'ăn', 'đẹp', 'cây'], correctAnswer: 'tôi', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 147, question: 'Câu nào có sử dụng biện pháp so sánh?', options: ['Đẹp như tiên', 'Đẹp', 'Xinh đẹp', 'Rất đẹp'], correctAnswer: 'Đẹp như tiên', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 148, question: 'Từ nào có nghĩa trái ngược với "hòa bình"?', options: ['chiến tranh', 'tình yêu', 'hạnh phúc', 'ấm no'], correctAnswer: 'chiến tranh', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 149, question: 'Từ nào là từ ghép đẳng lập?', options: ['sách vở', 'cây cối', 'xe cộ', 'nhà cửa'], correctAnswer: 'sách vở', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
    { id: 150, question: 'Câu nào là câu khiến?', options: ['Em hãy học bài đi!', 'Em đã học bài chưa?', 'Em học bài đấy.', 'Chà, học giỏi quá!'], correctAnswer: 'Em hãy học bài đi!', subject: 'Tiếng Việt', grade: '5', difficulty: 'hard' },
  ],

  // ============================
  // 📕 TIẾNG ANH - 50 câu
  // ============================
  english: [
    // Dễ (Lớp 1-2)
    { id: 201, question: '"Apple" có nghĩa là gì?', options: ['Quả cam', 'Quả táo', 'Quả xoài', 'Quả lê'], correctAnswer: 'Quả táo', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 202, question: '"Cat" có nghĩa là gì?', options: ['Con chó', 'Con mèo', 'Con gà', 'Con vịt'], correctAnswer: 'Con mèo', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 203, question: '"Red" có nghĩa là gì?', options: ['Màu xanh', 'Màu đỏ', 'Màu vàng', 'Màu tím'], correctAnswer: 'Màu đỏ', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 204, question: '"Book" có nghĩa là gì?', options: ['Bút', 'Sách', 'Vở', 'Bảng'], correctAnswer: 'Sách', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 205, question: '"Hello" có nghĩa là gì?', options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'], correctAnswer: 'Xin chào', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 206, question: '"Dog" có nghĩa là gì?', options: ['Con mèo', 'Con chó', 'Con chim', 'Con cá'], correctAnswer: 'Con chó', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 207, question: '"Blue" có nghĩa là gì?', options: ['Màu đỏ', 'Màu xanh dương', 'Màu vàng', 'Màu hồng'], correctAnswer: 'Màu xanh dương', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 208, question: '"One" có nghĩa là gì?', options: ['Hai', 'Một', 'Ba', 'Bốn'], correctAnswer: 'Một', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 209, question: '"Good" có nghĩa là gì?', options: ['Xấu', 'Tốt', 'Đẹp', 'Xinh'], correctAnswer: 'Tốt', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 210, question: '"Fish" có nghĩa là gì?', options: ['Con chim', 'Con cá', 'Con rắn', 'Con sâu'], correctAnswer: 'Con cá', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 211, question: '"Mother" có nghĩa là gì?', options: ['Bố', 'Mẹ', 'Anh', 'Em'], correctAnswer: 'Mẹ', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 212, question: '"Happy" có nghĩa là gì?', options: ['Buồn', 'Vui', 'Giận', 'Sợ'], correctAnswer: 'Vui', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 213, question: '"School" có nghĩa là gì?', options: ['Nhà', 'Trường học', 'Bệnh viện', 'Công ty'], correctAnswer: 'Trường học', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 214, question: '"Sun" có nghĩa là gì?', options: ['Mặt trăng', 'Mặt trời', 'Ngôi sao', 'Mây'], correctAnswer: 'Mặt trời', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    { id: 215, question: '"Yes" có nghĩa là gì?', options: ['Không', 'Có', 'Cảm ơn', 'Xin lỗi'], correctAnswer: 'Có', subject: 'Tiếng Anh', grade: '1', difficulty: 'easy' },
    
    // Trung bình (Lớp 2-3)
    { id: 216, question: '"Beautiful" có nghĩa là gì?', options: ['Xấu', 'Đẹp', 'Cao', 'Thấp'], correctAnswer: 'Đẹp', subject: 'Tiếng Anh', grade: '2', difficulty: 'medium' },
    { id: 217, question: '"Student" có nghĩa là gì?', options: ['Giáo viên', 'Học sinh', 'Bác sĩ', 'Kỹ sư'], correctAnswer: 'Học sinh', subject: 'Tiếng Anh', grade: '2', difficulty: 'medium' },
    { id: 218, question: '"Easy" có nghĩa là gì?', options: ['Khó', 'Dễ', 'Đẹp', 'Nhanh'], correctAnswer: 'Dễ', subject: 'Tiếng Anh', grade: '2', difficulty: 'medium' },
    { id: 219, question: 'Câu nào đúng với thì hiện tại đơn cho chủ ngữ "He"?', options: ['He play football', 'He plays football', 'He playing football', 'He played football'], correctAnswer: 'He plays football', subject: 'Tiếng Anh', grade: '2', difficulty: 'medium' },
    { id: 220, question: '"I am a student." dịch là gì?', options: ['Tôi là giáo viên', 'Tôi là học sinh', 'Tôi là bác sĩ', 'Tôi là kỹ sư'], correctAnswer: 'Tôi là học sinh', subject: 'Tiếng Anh', grade: '2', difficulty: 'medium' },
    { id: 221, question: '"She is my mother." dịch là gì?', options: ['Cô ấy là mẹ tôi', 'Cô ấy là chị tôi', 'Cô ấy là em tôi', 'Cô ấy là bạn tôi'], correctAnswer: 'Cô ấy là mẹ tôi', subject: 'Tiếng Anh', grade: '2', difficulty: 'medium' },
    { id: 222, question: '"I like dogs." dịch là gì?', options: ['Tôi ghét chó', 'Tôi thích chó', 'Tôi có chó', 'Tôi không thích chó'], correctAnswer: 'Tôi thích chó', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 223, question: '"Where are you from?" dịch là gì?', options: ['Bạn là ai?', 'Bạn đến từ đâu?', 'Bạn bao nhiêu tuổi?', 'Bạn làm gì?'], correctAnswer: 'Bạn đến từ đâu?', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 224, question: '"What is your name?" dịch là gì?', options: ['Bạn bao nhiêu tuổi?', 'Tên bạn là gì?', 'Bạn đến từ đâu?', 'Bạn làm gì?'], correctAnswer: 'Tên bạn là gì?', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 225, question: '"How old are you?" dịch là gì?', options: ['Bạn là ai?', 'Bạn bao nhiêu tuổi?', 'Bạn đến từ đâu?', 'Bạn làm gì?'], correctAnswer: 'Bạn bao nhiêu tuổi?', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 226, question: '"Big" có nghĩa trái ngược với từ nào?', options: ['Small', 'Large', 'Huge', 'Tall'], correctAnswer: 'Small', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 227, question: '"Happy" có nghĩa trái ngược với từ nào?', options: ['Sad', 'Joyful', 'Cheerful', 'Glad'], correctAnswer: 'Sad', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 228, question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'went'], correctAnswer: 'goes', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 229, question: 'I ___ a student.', options: ['is', 'am', 'are', 'be'], correctAnswer: 'am', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    { id: 230, question: 'They ___ playing football now.', options: ['is', 'am', 'are', 'be'], correctAnswer: 'are', subject: 'Tiếng Anh', grade: '3', difficulty: 'medium' },
    
    // Khó (Lớp 4-5)
    { id: 231, question: '"Wonderful" có nghĩa là gì?', options: ['Tồi tệ', 'Tuyệt vời', 'Bình thường', 'Xấu xí'], correctAnswer: 'Tuyệt vời', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 232, question: '"Appropriate" có nghĩa là gì?', options: ['Không phù hợp', 'Phù hợp', 'Đẹp', 'Xấu'], correctAnswer: 'Phù hợp', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 233, question: 'She has been studying English ___ 5 years.', options: ['for', 'since', 'during', 'while'], correctAnswer: 'for', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 234, question: 'I have lived here ___ 2010.', options: ['for', 'since', 'during', 'while'], correctAnswer: 'since', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 235, question: '"Would you like some coffee?" có nghĩa là gì?', options: ['Bạn có thích cà phê không?', 'Bạn muốn uống cà phê chứ?', 'Bạn có cà phê không?', 'Cà phê ngon không?'], correctAnswer: 'Bạn muốn uống cà phê chứ?', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 236, question: '"Could you help me?" có nghĩa là gì?', options: ['Bạn có thể giúp tôi không?', 'Bạn đã giúp tôi chưa?', 'Bạn sẽ giúp tôi chứ?', 'Bạn không giúp tôi à?'], correctAnswer: 'Bạn có thể giúp tôi không?', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 237, question: '"Although it was raining, we went out." dịch là gì?', options: ['Mặc dù trời mưa, chúng tôi đã ra ngoài.', 'Vì trời mưa, chúng tôi đã ra ngoài.', 'Nếu trời mưa, chúng tôi đã ra ngoài.', 'Khi trời mưa, chúng tôi đã ra ngoài.'], correctAnswer: 'Mặc dù trời mưa, chúng tôi đã ra ngoài.', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 238, question: '"If I were you, I would study hard." dịch là gì?', options: ['Nếu tôi là bạn, tôi sẽ học chăm chỉ.', 'Nếu bạn là tôi, bạn sẽ học chăm chỉ.', 'Tôi đã học chăm chỉ như bạn.', 'Bạn đã học chăm chỉ như tôi.'], correctAnswer: 'Nếu tôi là bạn, tôi sẽ học chăm chỉ.', subject: 'Tiếng Anh', grade: '4', difficulty: 'hard' },
    { id: 239, question: '"Beautiful" có dạng so sánh nhất là gì?', options: ['Beautifuler', 'More beautiful', 'Most beautiful', 'Beautifullest'], correctAnswer: 'Most beautiful', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 240, question: '"Good" có dạng so sánh nhất là gì?', options: ['Gooder', 'More good', 'Best', 'Better'], correctAnswer: 'Best', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 241, question: '"She is the ___ student in class." (intelligent)', options: ['most intelligent', 'more intelligent', 'intelligenter', 'intelligentest'], correctAnswer: 'most intelligent', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 242, question: 'He has ___ to Ho Chi Minh City many times.', options: ['go', 'goes', 'gone', 'went'], correctAnswer: 'gone', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 243, question: 'By the time you arrive, we ___ dinner.', options: ['will finish', 'will have finished', 'finished', 'have finished'], correctAnswer: 'will have finished', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 244, question: '"In spite of the rain, we enjoyed the trip." có nghĩa là gì?', options: ['Mặc dù trời mưa, chúng tôi đã tận hưởng chuyến đi.', 'Vì trời mưa, chúng tôi đã tận hưởng chuyến đi.', 'Trời mưa nên chúng tôi tận hưởng chuyến đi.', 'Chúng tôi tận hưởng chuyến đi vì trời mưa.'], correctAnswer: 'Mặc dù trời mưa, chúng ý đã tận hưởng chuyến đi.', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 245, question: 'Which word is the opposite of "ancient"?', options: ['old', 'modern', 'historic', 'traditional'], correctAnswer: 'modern', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 246, question: 'Which word is a synonym of "quickly"?', options: ['slowly', 'rapidly', 'lazily', 'carefully'], correctAnswer: 'rapidly', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 247, question: '"Children" là dạng số nhiều của từ nào?', options: ['Child', 'Childs', 'Childes', 'Childies'], correctAnswer: 'Child', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 248, question: '"She enjoys ___ books." (read)', options: ['read', 'reads', 'reading', 'to read'], correctAnswer: 'reading', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 249, question: 'The teacher made us ___ homework everyday.', options: ['do', 'to do', 'doing', 'did'], correctAnswer: 'do', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
    { id: 250, question: 'He is looking forward ___ his vacation.', options: ['to', 'for', 'at', 'on'], correctAnswer: 'to', subject: 'Tiếng Anh', grade: '5', difficulty: 'hard' },
  ],

  // ============================
  // 📒 LỊCH SỬ - 50 câu
  // ============================
  history: [
    // Dễ (Lớp 4-5)
    { id: 301, question: 'Quốc gia nào có thủ đô là Hà Nội?', options: ['Lào', 'Campuchia', 'Việt Nam', 'Thái Lan'], correctAnswer: 'Việt Nam', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 302, question: 'Bác Hồ sinh năm nào?', options: ['1890', '1891', '1892', '1893'], correctAnswer: '1890', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 303, question: 'Ngày Quốc khánh của Việt Nam là ngày nào?', options: ['30/4', '1/5', '2/9', '19/5'], correctAnswer: '2/9', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 304, question: 'Chiến thắng Điện Biên Phủ diễn ra năm nào?', options: ['1945', '1954', '1965', '1975'], correctAnswer: '1954', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 305, question: 'Ai là vị vua đầu tiên của nước ta?', options: ['Hùng Vương', 'An Dương Vương', 'Lý Thái Tổ', 'Trần Hưng Đạo'], correctAnswer: 'Hùng Vương', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 306, question: 'Tên nước ta thời kỳ đầu tiên là gì?', options: ['Đại Cồ Việt', 'Đại Việt', 'Văn Lang', 'Âu Lạc'], correctAnswer: 'Văn Lang', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 307, question: 'Ai là người lãnh đạo cuộc khởi nghĩa Hai Bà Trưng?', options: ['Trưng Trắc và Trưng Nhị', 'Bà Triệu', 'Lý Bí', 'Ngô Quyền'], correctAnswer: 'Trưng Trắc và Trưng Nhị', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 308, question: 'Ngô Quyền đánh thắng quân Nam Hán trên sông nào?', options: ['Sông Hồng', 'Sông Bạch Đằng', 'Sông Cửu Long', 'Sông Mã'], correctAnswer: 'Sông Bạch Đằng', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 309, question: 'Thời kỳ nào gọi là thời kỳ Bắc thuộc?', options: ['Đô hộ của Trung Quốc', 'Đô hộ của Pháp', 'Đô hộ của Nhật', 'Đô hộ của Mỹ'], correctAnswer: 'Đô hộ của Trung Quốc', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 310, question: 'Lý Thái Tổ dời đô về Thăng Long năm nào?', options: ['1000', '1009', '1010', '1011'], correctAnswer: '1010', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 311, question: 'Trần Hưng Đạo đã 3 lần đánh thắng quân nào?', options: ['Quân Minh', 'Quân Thanh', 'Quân Nguyên Mông', 'Quân Nam Hán'], correctAnswer: 'Quân Nguyên Mông', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 312, question: 'Chiến thắng nào được gọi là "lừng lẫy năm châu, chấn động địa cầu"?', options: ['Điện Biên Phủ', 'Bạch Đằng', 'Chi Lăng', 'Đống Đa'], correctAnswer: 'Điện Biên Phủ', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 313, question: 'Bác Hồ đọc bản Tuyên ngôn Độc lập tại đâu?', options: ['Phủ Chủ tịch', 'Quảng trường Ba Đình', 'Bến Nhà Rồng', 'Đền Hùng'], correctAnswer: 'Quảng trường Ba Đình', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 314, question: 'Ngày 30/4/1975 là ngày gì?', options: ['Giải phóng miền Nam', 'Quốc khánh', 'Ngày sinh Bác Hồ', 'Ngày Hiến chương'], correctAnswer: 'Giải phóng miền Nam', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    { id: 315, question: 'Quang Trung đánh thắng quân Thanh tại trận nào?', options: ['Ngọc Hồi - Đống Đa', 'Điện Biên Phủ', 'Bạch Đằng', 'Chi Lăng'], correctAnswer: 'Ngọc Hồi - Đống Đa', subject: 'Lịch sử', grade: '4', difficulty: 'easy' },
    
    // Trung bình (Lớp 4-5)
    { id: 316, question: 'Thời kỳ nào nước ta bị đô hộ bởi nhà Minh?', options: ['Thế kỷ 9-10', 'Thế kỷ 11-12', 'Thế kỷ 13-14', 'Thế kỷ 15-16'], correctAnswer: 'Thế kỷ 15-16', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 317, question: 'Ai là người sáng lập ra triều đại nhà Nguyễn?', options: ['Nguyễn Huệ', 'Nguyễn Ánh', 'Nguyễn Trãi', 'Nguyễn Du'], correctAnswer: 'Nguyễn Ánh', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 318, question: 'Phong trào Đông Du do ai lãnh đạo?', options: ['Phan Bội Châu', 'Phan Chu Trinh', 'Nguyễn Tất Thành', 'Tôn Đức Thắng'], correctAnswer: 'Phan Bội Châu', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 319, question: 'Đảng Cộng sản Việt Nam thành lập năm nào?', options: ['1925', '1930', '1945', '1954'], correctAnswer: '1930', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 320, question: 'Cách mạng Tháng Tám thành công năm nào?', options: ['1930', '1945', '1954', '1975'], correctAnswer: '1945', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 321, question: 'Trận "Điện Biên Phủ trên không" diễn ra ở đâu?', options: ['Hà Nội', 'Hải Phòng', 'Đà Nẵng', 'TP.HCM'], correctAnswer: 'Hà Nội', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 322, question: 'Ai là người ký Hiệp định Paris năm 1973?', options: ['Phạm Văn Đồng', 'Lê Đức Thọ', 'Võ Nguyên Giáp', 'Trường Chinh'], correctAnswer: 'Lê Đức Thọ', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 323, question: 'Chiến dịch Hồ Chí Minh diễn ra vào năm nào?', options: ['1972', '1973', '1974', '1975'], correctAnswer: '1975', subject: 'Lịch sử', grade: '4', difficulty: 'medium' },
    { id: 324, question: 'Nhà văn hóa lớn thời Trần là ai?', options: ['Trần Nhân Tông', 'Trần Quang Khải', 'Trần Hưng Đạo', 'Trần Thánh Tông'], correctAnswer: 'Trần Nhân Tông', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    { id: 325, question: 'Văn Miếu Quốc Tử Giám được xây dựng dưới triều đại nào?', options: ['Lý', 'Trần', 'Lê', 'Nguyễn'], correctAnswer: 'Lý', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    { id: 326, question: 'Nước ta có tên là "Đại Việt" từ triều đại nào?', options: ['Lý', 'Trần', 'Lê', 'Nguyễn'], correctAnswer: 'Lý', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    { id: 327, question: 'Ai là tướng chỉ huy trong trận Chi Lăng?', options: ['Lê Lợi', 'Nguyễn Trãi', 'Lê Thái Tổ', 'Lê Hoàn'], correctAnswer: 'Lê Lợi', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    { id: 328, question: 'Thành Cổ Loa do ai xây dựng?', options: ['An Dương Vương', 'Hùng Vương', 'Lý Thái Tổ', 'Ngô Quyền'], correctAnswer: 'An Dương Vương', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    { id: 329, question: 'Nhà Lý có bao nhiêu đời vua?', options: ['7', '8', '9', '10'], correctAnswer: '9', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    { id: 330, question: 'Triều đại nào kéo dài nhất lịch sử phong kiến Việt Nam?', options: ['Lý', 'Trần', 'Lê', 'Nguyễn'], correctAnswer: 'Lê', subject: 'Lịch sử', grade: '5', difficulty: 'medium' },
    
    // Khó (Lớp 5)
    { id: 331, question: 'Hiệp định Giơ-ne-vơ được ký năm nào?', options: ['1953', '1954', '1955', '1956'], correctAnswer: '1954', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 332, question: 'Vua Lê Thánh Tông có đóng góp gì lớn?', options: ['Bộ luật Hồng Đức', 'Khởi nghĩa Lam Sơn', 'Dời đô về Thăng Long', 'Chống Nguyên Mông'], correctAnswer: 'Bộ luật Hồng Đức', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 333, question: 'Ai là người chiến thắng trong trận Chi Lăng - Xương Giang?', options: ['Lê Lợi', 'Lê Thái Tổ', 'Lê Thánh Tông', 'Nguyễn Trãi'], correctAnswer: 'Lê Lợi', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 334, question: 'Triều đại nào là triều đại cuối cùng trong lịch sử phong kiến Việt Nam?', options: ['Lê', 'Trần', 'Nguyễn', 'Tây Sơn'], correctAnswer: 'Nguyễn', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 335, question: 'Năm 938 là năm của sự kiện nào?', options: ['Ngô Quyền đánh thắng quân Nam Hán', 'Đinh Bộ Lĩnh dẹp loạn', 'Lý Thái Tổ dời đô', 'Trần Hưng Đạo đánh Nguyên Mông'], correctAnswer: 'Ngô Quyền đánh thắng quân Nam Hán', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 336, question: 'Hội nghị nào đã thống nhất các tổ chức cộng sản ở Việt Nam?', options: ['Hội nghị Hương Cảng', 'Hội nghị Thượng Hải', 'Hội nghị Quảng Châu', 'Hội nghị Bắc Kinh'], correctAnswer: 'Hội nghị Hương Cảng', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 337, question: 'Phong trào Cần Vương do ai lãnh đạo?', options: ['Tôn Thất Thuyết', 'Phan Đình Phùng', 'Nguyễn Huệ', 'Quang Trung'], correctAnswer: 'Tôn Thất Thuyết', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 338, question: 'Khởi nghĩa Yên Thế do ai lãnh đạo?', options: ['Hoàng Hoa Thám', 'Nguyễn Thiện Thuật', 'Đề Nắm', 'Cai Tổng Vàng'], correctAnswer: 'Hoàng Hoa Thám', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 339, question: 'Vua nào đã dời đô từ Hoa Lư về Thăng Long?', options: ['Lý Thái Tổ', 'Lý Thánh Tông', 'Lý Nhân Tông', 'Lý Cao Tông'], correctAnswer: 'Lý Thái Tổ', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 340, question: 'Cuộc chiến nào diễn ra năm 1288?', options: ['Trận Bạch Đằng lần 3', 'Trận Chi Lăng', 'Trận Ngọc Hồi', 'Trận Đống Đa'], correctAnswer: 'Trận Bạch Đằng lần 3', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 341, question: 'Ai là tác giả của "Bình Ngô đại cáo"?', options: ['Nguyễn Trãi', 'Lê Lợi', 'Trần Hưng Đạo', 'Nguyễn Du'], correctAnswer: 'Nguyễn Trãi', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 342, question: 'Nhà Hậu Lê được thành lập vào năm nào?', options: ['1418', '1428', '1438', '1448'], correctAnswer: '1428', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 343, question: 'Quang Trung lên ngôi Hoàng đế năm nào?', options: ['1778', '1788', '1798', '1808'], correctAnswer: '1788', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 344, question: 'Vua nào là người cuối cùng của triều Nguyễn?', options: ['Bảo Đại', 'Khải Định', 'Duy Tân', 'Thành Thái'], correctAnswer: 'Bảo Đại', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
    { id: 345, question: 'Cuộc khởi nghĩa Lam Sơn kéo dài bao nhiêu năm?', options: ['10', '11', '12', '13'], correctAnswer: '10', subject: 'Lịch sử', grade: '5', difficulty: 'hard' },
  ],

  // ============================
  // 📙 ĐỊA LÝ - 50 câu
  // ============================
  geography: [
    // Dễ (Lớp 4)
    { id: 401, question: 'Thủ đô của Việt Nam là gì?', options: ['TP.HCM', 'Đà Nẵng', 'Hà Nội', 'Hải Phòng'], correctAnswer: 'Hà Nội', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 402, question: 'Sông nào dài nhất Việt Nam?', options: ['Sông Hồng', 'Sông Mê Kông', 'Sông Đà', 'Sông Thái Bình'], correctAnswer: 'Sông Mê Kông', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 403, question: 'Biển nào giáp với Việt Nam?', options: ['Biển Đỏ', 'Biển Đông', 'Biển Đen', 'Biển Bắc'], correctAnswer: 'Biển Đông', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 404, question: 'Núi nào cao nhất Việt Nam?', options: ['Núi Fansipan', 'Núi Tây Côn Lĩnh', 'Núi Phan Xi Păng', 'Núi Bạch Mã'], correctAnswer: 'Núi Fansipan', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 405, question: 'Đảo nào lớn nhất Việt Nam?', options: ['Cát Bà', 'Phú Quốc', 'Côn Đảo', 'Lý Sơn'], correctAnswer: 'Phú Quốc', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 406, question: 'Miền Bắc Việt Nam có mấy mùa?', options: ['2', '3', '4', '5'], correctAnswer: '4', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 407, question: 'Thành phố nào là trung tâm kinh tế lớn nhất Việt Nam?', options: ['Hà Nội', 'Đà Nẵng', 'TP.HCM', 'Hải Phòng'], correctAnswer: 'TP.HCM', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 408, question: 'Vịnh Hạ Long thuộc tỉnh nào?', options: ['Quảng Ninh', 'Hải Phòng', 'Thái Bình', 'Nam Định'], correctAnswer: 'Quảng Ninh', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 409, question: 'Đồng bằng nào lớn nhất Việt Nam?', options: ['Đồng bằng Bắc Bộ', 'Đồng bằng Nam Bộ', 'Đồng bằng Duyên Hải', 'Đồng bằng Tây Nguyên'], correctAnswer: 'Đồng bằng Nam Bộ', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 410, question: 'Nước nào giáp phía Bắc Việt Nam?', options: ['Lào', 'Campuchia', 'Trung Quốc', 'Thái Lan'], correctAnswer: 'Trung Quốc', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 411, question: 'Đà Lạt thuộc tỉnh nào?', options: ['Lâm Đồng', 'Đắk Lắk', 'Gia Lai', 'Kon Tum'], correctAnswer: 'Lâm Đồng', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 412, question: 'Sông Cửu Long có mấy nhánh đổ ra biển?', options: ['6', '7', '8', '9'], correctAnswer: '9', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 413, question: 'Phố cổ Hội An thuộc tỉnh nào?', options: ['Quảng Nam', 'Đà Nẵng', 'Thừa Thiên Huế', 'Quảng Ngãi'], correctAnswer: 'Quảng Nam', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 414, question: 'Nha Trang thuộc tỉnh nào?', options: ['Bình Thuận', 'Khánh Hòa', 'Ninh Thuận', 'Phú Yên'], correctAnswer: 'Khánh Hòa', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    { id: 415, question: 'Cao nguyên nào cao nhất Việt Nam?', options: ['Lâm Viên', 'Mộc Châu', 'Đắk Lắk', 'Pleiku'], correctAnswer: 'Lâm Viên', subject: 'Địa lý', grade: '4', difficulty: 'easy' },
    
    // Trung bình (Lớp 4-5)
    { id: 416, question: 'Diện tích Việt Nam khoảng bao nhiêu km²?', options: ['~300.000', '~331.000', '~400.000', '~500.000'], correctAnswer: '~331.000', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 417, question: 'Khí hậu miền Bắc khác miền Nam như thế nào?', options: ['Có 4 mùa rõ rệt', 'Nóng quanh năm', 'Mưa nhiều', 'Mát mẻ'], correctAnswer: 'Có 4 mùa rõ rệt', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 418, question: 'Dãy núi nào là ranh giới giữa hai miền khí hậu?', options: ['Hoàng Liên Sơn', 'Trường Sơn', 'Tam Đảo', 'Bạch Mã'], correctAnswer: 'Bạch Mã', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 419, question: 'Vùng nào có nhiều núi lửa nhất Việt Nam?', options: ['Tây Nguyên', 'Đông Nam Bộ', 'Duyên Hải Nam Trung Bộ', 'Đồng bằng sông Cửu Long'], correctAnswer: 'Tây Nguyên', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 420, question: 'Đèo nào nổi tiếng nhất ở miền Trung?', options: ['Đèo Ngang', 'Đèo Hải Vân', 'Đèo Cả', 'Đèo Khánh Lê'], correctAnswer: 'Đèo Hải Vân', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 421, question: 'Nước ta có bao nhiêu tỉnh thành phố?', options: ['63', '64', '65', '66'], correctAnswer: '63', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 422, question: 'Thành phố nào là thủ đô của Lào?', options: ['Hà Nội', 'Viêng Chăn', 'Phnom Penh', 'Bangkok'], correctAnswer: 'Viêng Chăn', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 423, question: 'Quốc gia nào có diện tích lớn nhất Đông Nam Á?', options: ['Indonesia', 'Việt Nam', 'Thái Lan', 'Myanmar'], correctAnswer: 'Indonesia', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 424, question: 'Châu Á có bao nhiêu quốc gia?', options: ['40', '45', '48', '50'], correctAnswer: '48', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 425, question: 'Sông nào dài nhất thế giới?', options: ['Sông Nile', 'Sông Amazon', 'Sông Dương Tử', 'Sông Mississippi'], correctAnswer: 'Sông Nile', subject: 'Địa lý', grade: '4', difficulty: 'medium' },
    { id: 426, question: 'Hoang mạc lớn nhất thế giới là gì?', options: ['Sahara', 'Gobi', 'Kalahari', 'Atacama'], correctAnswer: 'Sahara', subject: 'Địa lý', grade: '5', difficulty: 'medium' },
    { id: 427, question: 'Đỉnh núi cao nhất thế giới là gì?', options: ['K2', 'Everest', 'Fansipan', 'Kangchenjunga'], correctAnswer: 'Everest', subject: 'Địa lý', grade: '5', difficulty: 'medium' },
    { id: 428, question: 'Đại dương nào lớn nhất thế giới?', options: ['Đại Tây Dương', 'Thái Bình Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'], correctAnswer: 'Thái Bình Dương', subject: 'Địa lý', grade: '5', difficulty: 'medium' },
    { id: 429, question: 'Hồ nào sâu nhất thế giới?', options: ['Hồ Baikal', 'Hồ Victoria', 'Hồ Tanganyika', 'Hồ Superior'], correctAnswer: 'Hồ Baikal', subject: 'Địa lý', grade: '5', difficulty: 'medium' },
    { id: 430, question: 'Thác nước nào lớn nhất thế giới?', options: ['Thác Victoria', 'Thác Niagara', 'Thác Angel', 'Thác Iguazu'], correctAnswer: 'Thác Iguazu', subject: 'Địa lý', grade: '5', difficulty: 'medium' },
    
    // Khó (Lớp 5)
    { id: 431, question: 'Kinh tuyến gốc đi qua đâu?', options: ['Greenwich', 'Hà Nội', 'Paris', 'Tokyo'], correctAnswer: 'Greenwich', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 432, question: 'Vĩ tuyến Bắc của Việt Nam là bao nhiêu độ?', options: ['~8°B', '~23°B', '~20°B', '~15°B'], correctAnswer: '~23°B', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 433, question: 'Đường xích đạo chia trái đất thành mấy bán cầu?', options: ['1', '2', '3', '4'], correctAnswer: '2', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 434, question: 'Châu lục nào có số dân đông nhất?', options: ['Châu Á', 'Châu Phi', 'Châu Âu', 'Châu Mỹ'], correctAnswer: 'Châu Á', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 435, question: 'Rừng nhiệt đới lớn nhất thế giới ở đâu?', options: ['Amazon', 'Congo', 'Indonesia', 'Đông Nam Á'], correctAnswer: 'Amazon', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 436, question: 'Cực Nam của Trái Đất nằm ở đâu?', options: ['Bắc Cực', 'Nam Cực', 'Châu Á', 'Châu Phi'], correctAnswer: 'Nam Cực', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 437, question: 'Thủ đô của Úc là gì?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctAnswer: 'Canberra', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 438, question: 'Quốc gia nào có nhiều đảo nhất thế giới?', options: ['Indonesia', 'Philippines', 'Japan', 'Sweden'], correctAnswer: 'Sweden', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 439, question: 'Châu lục nào nhỏ nhất thế giới?', options: ['Châu Á', 'Châu Âu', 'Châu Úc', 'Châu Nam Cực'], correctAnswer: 'Châu Úc', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 440, question: 'Sông nào chảy qua nhiều quốc gia nhất?', options: ['Sông Danube', 'Sông Nile', 'Sông Amazon', 'Sông Mekong'], correctAnswer: 'Sông Danube', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 441, question: 'Núi lửa nào hoạt động mạnh nhất thế giới?', options: ['Kilauea', 'Mauna Loa', 'Etna', 'Fuji'], correctAnswer: 'Kilauea', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 442, question: 'Biển nào mặn nhất thế giới?', options: ['Biển Đỏ', 'Biển Chết', 'Biển Đen', 'Biển Baltic'], correctAnswer: 'Biển Chết', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 443, question: 'Hồ nước ngọt lớn nhất châu Á là gì?', options: ['Hồ Baikal', 'Hồ Tonlé Sap', 'Hồ Biwa', 'Hồ Poyang'], correctAnswer: 'Hồ Baikal', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 444, question: 'Thành phố nào đông dân nhất thế giới?', options: ['Tokyo', 'Delhi', 'Shanghai', 'Mumbai'], correctAnswer: 'Tokyo', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
    { id: 445, question: 'Đường biên giới dài nhất thế giới là giữa hai nước nào?', options: ['Hoa Kỳ - Canada', 'Nga - Trung Quốc', 'Ấn Độ - Trung Quốc', 'Brazil - Argentina'], correctAnswer: 'Hoa Kỳ - Canada', subject: 'Địa lý', grade: '5', difficulty: 'hard' },
  ],

  // ============================
  // 🔬 KHOA HỌC - 50 câu
  // ============================
  science: [
    // Dễ (Lớp 3-4)
    { id: 501, question: 'Nước sôi ở nhiệt độ bao nhiêu độ C?', options: ['80°C', '90°C', '100°C', '110°C'], correctAnswer: '100°C', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 502, question: 'Nước đông đặc ở nhiệt độ bao nhiêu độ C?', options: ['-5°C', '0°C', '5°C', '10°C'], correctAnswer: '0°C', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 503, question: 'Mặt trời có màu gì?', options: ['Xanh', 'Đỏ', 'Vàng', 'Trắng'], correctAnswer: 'Vàng', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 504, question: 'Trái đất quay quanh gì?', options: ['Mặt trăng', 'Mặt trời', 'Sao Hỏa', 'Sao Mộc'], correctAnswer: 'Mặt trời', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 505, question: 'Con vật nào dưới nước?', options: ['Chim', 'Cá', 'Mèo', 'Chó'], correctAnswer: 'Cá', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 506, question: 'Thực vật nào cần ánh sáng để quang hợp?', options: ['Cây', 'Động vật', 'Con người', 'Vi khuẩn'], correctAnswer: 'Cây', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 507, question: 'Hành tinh nào gần mặt trời nhất?', options: ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa'], correctAnswer: 'Sao Thủy', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 508, question: 'Con người thở bằng gì?', options: ['Tim', 'Phổi', 'Gan', 'Thận'], correctAnswer: 'Phổi', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 509, question: 'Sông ngòi cung cấp gì cho con người?', options: ['Nước', 'Đất', 'Cây', 'Khí'], correctAnswer: 'Nước', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 510, question: 'Gió là gì?', options: ['Không khí chuyển động', 'Nước chuyển động', 'Đất chuyển động', 'Lửa chuyển động'], correctAnswer: 'Không khí chuyển động', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 511, question: 'Công dụng của răng là gì?', options: ['Nhai thức ăn', 'Ngửi mùi', 'Nhìn thấy', 'Nghe âm thanh'], correctAnswer: 'Nhai thức ăn', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 512, question: 'Thực vật lấy nước từ đâu?', options: ['Rễ cây', 'Lá cây', 'Hoa', 'Thân cây'], correctAnswer: 'Rễ cây', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 513, question: 'Điều gì xảy ra khi đun nóng nước?', options: ['Nước bay hơi', 'Nước đông đặc', 'Nước đóng băng', 'Nước không đổi'], correctAnswer: 'Nước bay hơi', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 514, question: 'Chất nào là chất rắn?', options: ['Nước', 'Đá', 'Hơi nước', 'Không khí'], correctAnswer: 'Đá', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    { id: 515, question: 'Con gà có thể đẻ ra gì?', options: ['Trứng', 'Chó', 'Mèo', 'Cá'], correctAnswer: 'Trứng', subject: 'Khoa học', grade: '3', difficulty: 'easy' },
    
    // Trung bình (Lớp 4-5)
    { id: 516, question: 'Trái đất có bao nhiêu phần trăm là nước?', options: ['50%', '60%', '70%', '80%'], correctAnswer: '70%', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 517, question: 'Chu kỳ quay của trái đất quanh mặt trời là bao lâu?', options: ['1 ngày', '1 tháng', '1 năm', '1 tuần'], correctAnswer: '1 năm', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 518, question: 'Thực vật có quá trình gì quan trọng?', options: ['Quang hợp', 'Hô hấp', 'Tiêu hóa', 'Tuần hoàn'], correctAnswer: 'Quang hợp', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 519, question: 'Cơ thể người có bao nhiêu bộ xương?', options: ['1', '2', '3', '4'], correctAnswer: '1', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 520, question: 'Tại sao bầu trời có màu xanh?', options: ['Do tán xạ ánh sáng', 'Do mây', 'Do bụi', 'Do khí'], correctAnswer: 'Do tán xạ ánh sáng', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 521, question: 'Núi lửa phun ra gì?', options: ['Nước', 'Đá nóng và khói', 'Đất', 'Cây'], correctAnswer: 'Đá nóng và khói', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 522, question: 'Cơn bão gì có tên là "bão"?', options: ['Bão nhiệt đới', 'Bão tuyết', 'Bão cát', 'Bão lửa'], correctAnswer: 'Bão nhiệt đới', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 523, question: 'Thức ăn nào giàu protein?', options: ['Thịt', 'Rau', 'Trái cây', 'Gạo'], correctAnswer: 'Thịt', subject: 'Khoa học', grade: '4', difficulty: 'medium' },
    { id: 524, question: 'Năng lượng mặt trời thuộc loại năng lượng nào?', options: ['Năng lượng tái tạo', 'Năng lượng không tái tạo', 'Năng lượng hạt nhân', 'Năng lượng nhiệt'], correctAnswer: 'Năng lượng tái tạo', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    { id: 525, question: 'Các hành tinh quay quanh mặt trời theo quỹ đạo gì?', options: ['Hình tròn', 'Hình elip', 'Hình vuông', 'Hình tam giác'], correctAnswer: 'Hình elip', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    { id: 526, question: 'Chất nào dẫn điện tốt nhất?', options: ['Đồng', 'Nhôm', 'Sắt', 'Vàng'], correctAnswer: 'Đồng', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    { id: 527, question: 'Nguyên nhân gây ra mưa là gì?', options: ['Hơi nước bay lên và ngưng tụ', 'Nước sông', 'Nước biển', 'Nước hồ'], correctAnswer: 'Hơi nước bay lên và ngưng tụ', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    { id: 528, question: 'Cơ thể con người có thể hấp thụ vitamin D từ đâu?', options: ['Ánh sáng mặt trời', 'Nước', 'Không khí', 'Đất'], correctAnswer: 'Ánh sáng mặt trời', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    { id: 529, question: 'Điều gì xảy ra nếu không có không khí?', options: ['Không có sự sống', 'Nước vẫn chảy', 'Cây vẫn sống', 'Con người vẫn thở'], correctAnswer: 'Không có sự sống', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    { id: 530, question: 'Tại sao trăng tròn có màu trắng?', options: ['Do phản xạ ánh sáng mặt trời', 'Do tự phát sáng', 'Do màu của trăng', 'Do khí quyển'], correctAnswer: 'Do phản xạ ánh sáng mặt trời', subject: 'Khoa học', grade: '5', difficulty: 'medium' },
    
    // Khó (Lớp 5)
    { id: 531, question: 'Tế bào nào có thể tự tạo ra thức ăn?', options: ['Tế bào thực vật', 'Tế bào động vật', 'Tế bào người', 'Tế bào vi khuẩn'], correctAnswer: 'Tế bào thực vật', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 532, question: 'Quá trình nào tạo ra năng lượng trong tế bào?', options: ['Hô hấp tế bào', 'Quang hợp', 'Tiêu hóa', 'Bài tiết'], correctAnswer: 'Hô hấp tế bào', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 533, question: 'DNA có chức năng gì?', options: ['Lưu trữ thông tin di truyền', 'Tạo năng lượng', 'Bảo vệ tế bào', 'Vận chuyển chất'], correctAnswer: 'Lưu trữ thông tin di truyền', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 534, question: 'Màu sắc của ánh sáng mặt trời là gì?', options: ['Trắng', 'Vàng', 'Đỏ', 'Xanh'], correctAnswer: 'Trắng', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 535, question: 'Tốc độ ánh sáng là bao nhiêu?', options: ['~300.000 km/s', '100.000 km/s', '500.000 km/s', '1.000.000 km/s'], correctAnswer: '~300.000 km/s', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 536, question: 'Nguyên tử nào nhẹ nhất?', options: ['Hydrogen', 'Helium', 'Lithium', 'Beryllium'], correctAnswer: 'Hydrogen', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 537, question: 'Điều gì xảy ra khi cơ thể thiếu nước?', options: ['Mất nước', 'Thừa nước', 'Nhiều năng lượng', 'Khỏe mạnh'], correctAnswer: 'Mất nước', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 538, question: 'Bệnh nào do virus gây ra?', options: ['Cúm', 'Tiểu đường', 'Hen suyễn', 'Ung thư'], correctAnswer: 'Cúm', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 539, question: 'Khí quyển của trái đất có mấy lớp?', options: ['3', '4', '5', '6'], correctAnswer: '5', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 540, question: 'Lớp ozone bảo vệ trái đất khỏi gì?', options: ['Tia cực tím', 'Tia X', 'Tia gamma', 'Sóng vô tuyến'], correctAnswer: 'Tia cực tím', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 541, question: 'Chất nào là chất xúc tác trong cơ thể?', options: ['Enzyme', 'Vitamin', 'Khoáng chất', 'Protein'], correctAnswer: 'Enzyme', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 542, question: 'Điều gì tạo nên gió trên trái đất?', options: ['Sự chênh lệch nhiệt độ', 'Sự quay của trái đất', 'Nước biển', 'Núi lửa'], correctAnswer: 'Sự chênh lệch nhiệt độ', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 543, question: 'Tại sao cá sống được dưới nước?', options: ['Vì có mang', 'Vì có phổi', 'Vì có tim', 'Vì có xương'], correctAnswer: 'Vì có mang', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 544, question: 'Thực vật có mấy loại rễ chính?', options: ['2', '3', '4', '5'], correctAnswer: '2', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 545, question: 'Chất nào giúp cây phát triển tốt?', options: ['Phân bón', 'Bụi', 'Nước muối', 'Dầu mỡ'], correctAnswer: 'Phân bón', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 546, question: 'Hành tinh nào có nhiều vệ tinh nhất?', options: ['Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương', 'Sao Hải Vương'], correctAnswer: 'Sao Thổ', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 547, question: 'Mặt trăng có ảnh hưởng gì đến trái đất?', options: ['Thủy triều', 'Gió', 'Mưa', 'Tuyết'], correctAnswer: 'Thủy triều', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 548, question: 'Vụ nổ lớn (Big Bang) xảy ra khi nào?', options: ['~13.8 tỷ năm trước', '~4.5 tỷ năm trước', '~1 tỷ năm trước', '~100 triệu năm trước'], correctAnswer: '~13.8 tỷ năm trước', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 549, question: 'Công nghệ CRISPR dùng để làm gì?', options: ['Chỉnh sửa gen', 'Tạo năng lượng', 'Sản xuất thực phẩm', 'Xây dựng nhà'], correctAnswer: 'Chỉnh sửa gen', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
    { id: 550, question: 'Nguyên tử gồm những gì?', options: ['Proton, neutron, electron', 'Proton, electron', 'Neutron, electron', 'Proton, neutron'], correctAnswer: 'Proton, neutron, electron', subject: 'Khoa học', grade: '5', difficulty: 'hard' },
  ],
}

// ============================
// HÀM TIỆN ÍCH
// ============================

// Lấy danh sách môn học
export const subjectList = Object.keys(questionBank)

// Lấy tên hiển thị của môn học
export const subjectLabels: Record<string, string> = {
  math: '📘 Toán học',
  vietnamese: '📗 Tiếng Việt',
  english: '📕 Tiếng Anh',
  history: '📒 Lịch Sử',
  geography: '📙 Địa Lý',
  science: '🔬 Khoa Học',
}

// Hàm lấy toàn bộ ngân hàng câu hỏi hiện tại (kết hợp mặc định và tùy chỉnh từ localStorage)
export function getActiveQuestionBank(): Record<string, Question[]> {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('custom_question_bank')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Lỗi đọc câu hỏi từ localStorage", e)
      }
    }
  }
  return questionBank
}

// Hàm lấy câu hỏi theo môn học
export function getQuestionsBySubject(subject: string): Question[] {
  const activeBank = getActiveQuestionBank()
  return activeBank[subject] || []
}

// Lấy câu hỏi theo môn học và độ khó
export function getQuestionsBySubjectAndDifficulty(
  subject: string, 
  difficulty: 'easy' | 'medium' | 'hard'
): Question[] {
  const questions = getQuestionsBySubject(subject)
  return questions.filter(q => q.difficulty === difficulty)
}

// Lấy câu hỏi ngẫu nhiên theo môn học
export function getRandomQuestionsBySubject(
  subject: string, 
  limit: number = 10
): Question[] {
  const questions = getQuestionsBySubject(subject)
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, limit)
}

// Lấy câu hỏi theo môn và độ khó (ngẫu nhiên)
export function getQuestionsBySubjectAndDifficultyRandom(
  subject: string,
  difficulty: 'easy' | 'medium' | 'hard',
  limit: number = 10
): Question[] {
  const questions = getQuestionsBySubjectAndDifficulty(subject, difficulty)
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, limit)
}

// Lấy thống kê số lượng câu hỏi theo môn và độ khó
export function getQuestionStats(): Record<string, { total: number, easy: number, medium: number, hard: number }> {
  const stats: Record<string, { total: number, easy: number, medium: number, hard: number }> = {}
  const activeBank = getActiveQuestionBank()
  
  Object.keys(activeBank).forEach(subject => {
    const questions = activeBank[subject] || []
    const easy = questions.filter(q => q.difficulty === 'easy').length
    const medium = questions.filter(q => q.difficulty === 'medium').length
    const hard = questions.filter(q => q.difficulty === 'hard').length
    
    stats[subject] = {
      total: questions.length,
      easy,
      medium,
      hard
    }
  })
  
  return stats
}

// Lấy tổng số câu hỏi
export function getTotalQuestions(): number {
  let total = 0
  const activeBank = getActiveQuestionBank()
  Object.keys(activeBank).forEach(subject => {
    total += (activeBank[subject] || []).length
  })
  return total
}
