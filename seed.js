var seedData = {};
var seedStudios = [
    { title: '숙대입구 바디컨설팅', imageUrl: 'https://s3.ap-northeast-2.amazonaws.com/stone-i-dagym-centers/images/gyms/166a97dbc454a86a7d/4K6vXjmh1ZzfAmNno8779cDYgFCN969ckGG7ksRrSGzs.jpg', coordinates: { latitude: '37.5454287', longitude: '126.9723439' }, address: '서울 용산구 한강대로 304 3층', category: ["P.T", "요가"], details: { tel: "0504-3172-6953" }, followers: [], postedBy: 'partner@test.com' },
    { title: '혜화 리복크로스핏마루', imageUrl: 'https://s3.ap-northeast-2.amazonaws.com/stone-i-dagym-centers/images/gyms/15d60c366e332b321d/Big)Crossfitmaru.jpg', coordinates: { latitude: '37.5824917', longitude: '127.0024786' }, address: '서울특별시 종로구 대학로8가길 36 지하1층', category: ["크로스핏"], details: { tel: "0504-3172-6189" }, followers: [], postedBy: 'partner@test.com' },
    { title: '아현 ING 휘트니스', imageUrl: 'https://s3.ap-northeast-2.amazonaws.com/stone-i-dagym-centers/images/gyms/15ddc9a081548955/Big)INGAH.jpg', coordinates: { latitude: '37.5577767', longitude: '126.9575868' }, address: '서울특별시 서대문구 신촌로37길 20 1층', category: ["헬스", "G.X"], details: { tel: "0504-3172-6225" }, followers: [], postedBy: 'partner@test.com' },
    { title: '애오개 헬스존', imageUrl: 'https://s3.ap-northeast-2.amazonaws.com/stone-i-dagym-centers/images/gyms/1651f865fbf5da8d11/4K6vHwo1VEEgJTe12UX4rWkURqYqN8qn8gMu9ARDmgX9.jpg', coordinates: { latitude: '37.5500793', longitude: '126.9603341' }, address: '서울특별시 마포구 공덕동 29-5 1층', category: ["헬스"], details: { tel: "0504-3172-6710" }, followers: [], postedBy: 'partner2@test.com' },
    { title: '서대문 VIP 휘트니스', imageUrl: 'https://s3.ap-northeast-2.amazonaws.com/stone-i-dagym-centers/images/gyms/15f23730f0d4746062/Big)d.jpg', coordinates: { latitude: '37.5647925', longitude: '126.9643547' }, address: '서울특별시 서대문구 경기대로 68 동신빌딩 3층(2층,지하 1층)', category: ["헬스", "G.X"], details: { tel: "0504-3172-6306" }, followers: [], postedBy: 'partner2@test.com' },
    { title: '이대 제야딥요가', imageUrl: 'https://s3.ap-northeast-2.amazonaws.com/stone-i-dagym-centers/images/gyms/1694798375537614ef/4K6w6ZRr2QKo8rs3h1jMNGwBqZTJpMzMWEgQVgWX7kVV.jpg', coordinates: { latitude: '37.5579812', longitude: '126.9461000' }, address: '서울특별시 서대문구 이화여대길 26 이화빌딩 4층', category: ["요가"], details: { tel: "0504-3172-6818" }, followers: [], postedBy: 'partner2@test.com' },
];

var seedUsers = [{ email: 'test@test.com', username: 'tester', password: 'aaaaaa' }, { email: 'test2@test.com', username: 'tester2', password: 'aaaaaa' }]
var seedPartners = [{ email: 'partner@test.com', username: 'partner', password: 'aaaaaa' }, { email: 'partner2@test.com', username: 'partner2', password: 'aaaaaa' }]

seedData.studios = seedStudios;
seedData.users = seedUsers;
seedData.partners = seedPartners;


module.exports = seedData;