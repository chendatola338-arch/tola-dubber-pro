# 🎬 TOLA Dubber PRO (ឧបករណ៍បកប្រែ និងបញ្ចូលសំឡេងវីដេអូជាភាសាខ្មែរដោយ AI)

វេបសាយនេះត្រូវបានបង្កើតឡើងសម្រាប់ជួយដល់អ្នកបង្កើតមាតិកា (Content Creators), អ្នកកាត់តវីដេអូ និងអ្នកបកប្រែរឿង ក្នុងការបកប្រែវីដេអូពីភាសាផ្សេងៗ (ចិន, អង់គ្លេស, ថៃ, កូរ៉េ, ជប៉ុន...) ទៅជា **ភាសាខ្មែរ** និងបញ្ចូលសំឡេងស្វ័យប្រវត្តិតាមរយៈ AI ដោយផ្ទាល់នៅលើ Web Browser (100% Client-side)។

---

## ⚡ ការអាប់ដេតថ្មី៖ NISAY AI Gateway Integration + Progress Bar %

1. **NISAY Audio Transcriber (`nisay-transcribe`)**:
   - បម្លែងសំឡេងនិយាយពីវីដេអូ/Audio មកជាអត្ថបទយ៉ាងសុក្រឹតបំផុត (Verbatim Transcription)។
   - កំណត់ម៉ោងបែបមីលីវិនាទី (Millisecond Timestamps) យ៉ាងជាក់លាក់ មិនរំលង ឬកាត់សាច់រឿងឡើយ។
   - កំណត់ Speaker Diarization អព្យាក្រឹត (S0, S1, S2...)។

2. **NISAY Language Translation (`gpt-5.6-luna` v3.3)**:
   - គាំទ្រការបកប្រែរឿងកម្រិត Premium (Chinese General Drama, Action, Romance...) ដោយប្រើប្រាស់ម៉ូដែល **GPT-5.6 Luna**។
   - អនុវត្តអក្ខរាវិរុទ្ធខ្មែរស្ដង់ដារ ភាសាសន្ទនារស់រវើក សមស្របសម្រាប់ការបញ្ចូលសំឡេងរឿងភាគ។

3. **Live Processing Bar % (របារបង្ហាញភាគរយដំណាក់កាល)**:
   - បង្ហាញភាគរយពិតប្រាកដ (0% ➔ 100%) ពីមួយដំណាក់កាលទៅមួយដំណាក់កាល៖
     - **0% - 25%**: ស្រង់សំឡេងចេញពីវីដេអូ (Extract Audio 16kHz WAV)
     - **25% - 45%**: បម្លែងសំឡេងជាមួយ NISAY Transcribe
     - **45% - 75%**: បកប្រែជាភាសាខ្មែរជាមួយ NISAY GPT-5.6 Luna
     - **75% - 98%**: បញ្ចូលសំឡេងខ្មែរធម្មជាតិ (Edge TTS ពិសិដ្ឋ / ស្រីមុំ)
     - **100%**: រួចរាល់! អាច Preview និង Export បានភ្លាមៗ

---

## 🛠️ របៀបប្រើប្រាស់ NISAY API Key

1. បើកឯកសារ `index.html` លើ Browser (Chrome, Edge ឬ Brave)
2. ចូលទៅកាន់ Tab **Providers**
3. លោកអ្នកនឹងឃើញ **NISAY AI Gateway** ត្រូវបានបើកដំណើរការជាចម្បង (Primary Engine) ដោយភ្ជាប់មកជាមួយ API Key ស្រាប់៖
   - `nisay-int-shop-0d71b16d46264a65bd38b8c298cc09c7`
   - ចុចប៊ូតុង **✓ Check Key** ដើម្បីផ្ទៀងផ្ទាត់ស្ថានភាព Key ភ្លាមៗ
4. ជ្រើសរើសប្រភេទរឿង (Drama Category) ដូចជា **General Chinese Drama**
5. អូសទម្លាក់ (Drop) វីដេអូចូល រួចចុច **✨ Dub to Khmer**!

---

## 🌐 របៀបបង្ហោះ (Deploy) ទៅកាន់ GitHub Pages ដោយឥតគិតថ្លៃ

1. Upload ឯកសារទាំង ៣ នេះឡើងទៅកាន់ GitHub Repository របស់អ្នក៖
   - `index.html`
   - `style.css`
   - `app.js`
2. ចូលទៅកាន់ **Settings** -> **Pages** ជ្រើសរើស Branch `main` រួចចុច Save។
3. អ្នកនឹងទទួលបាន Link វេបសាយផ្ទាល់ខ្លួនសម្រាប់ប្រើប្រាស់គ្រប់ពេលវេលា!
