// تهيئة Firebase مع التحقق من التهيئة المسبقة
if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyBpcAxHT_MfOdi_SDHUm_1m08RmpWuDcZE",
      authDomain: "team-warek.firebaseapp.com",
      projectId: "team-warek",
      storageBucket: "team-warek.appspot.com",
      messagingSenderId: "183422365249",
      appId: "1:183422365249:web:ecc185e41a01a03af1a0c0",
      measurementId: "G-E7S2B4MDN9"
    };
    firebase.initializeApp(firebaseConfig);
  }
  
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // دالة إنشاء حقول الباقات
  function generatePackageFields(numberOfLines) {
    const container = document.getElementById('packageContainer');
    container.innerHTML = '';
  
    for (let i = 1; i <= numberOfLines; i++) {
      const div = document.createElement('div');
      div.className = 'package-field';
      div.innerHTML = `
       <label for="package${i}">الباقة للخط ${i}:</label>
            <select id="package${i}" name="package${i}" required>
                <option value="select package">Select pakage</option>
                <option value="Super kix 25">Super kix 25</option>
                <option value="Super kix 32">Super kix 32</option>
                <option value="Super kix 45">Super kix 45</option>
                <option value="Super kix 60">Super kix 60</option>
                <option value="Super kix 85">Super kix 85</option>
                <option value="Super kix 105">Super kix 105</option>
                <option value="Super kix 130">Super kix 130</option>
                <option value="New control Tazbeet 40">New control Tazbeet 40</option>
                <option value="New control Tazbeet 50">New control Tazbeet 50</option>
                <option value="New control Tazbeet 90">New control Tazbeet 90</option>
                <option value="New control Tazbeet 145">New control Tazbeet 145</option>
                <option value="We club 32">We club 32</option>
                <option value="We club 50">We club 50</option>
                <option value="We club 85">We club 85</option>
                <option value="We club 130">We club 130</option>
                <option value="We mix 215">We mix 215</option>
                <option value="We mix 310">We mix 310</option>
                <option value="Nitro 13">Nitro 13</option>
                <option value="Nitro 25">Nitro 25</option>
                <option value="Nitro 50">Nitro 50</option>
                <option value="Nitro 90">Nitro 90</option>
                <option value="Nitro 130">Nitro 130</option>
                <option value="Nitro 260">Nitro 260</option>
                <option value="Nitro 585">Nitro 585</option>
                <option value="We gold 260">We gold 260</option>
                <option value="We gold 525">We gold 525</option>
                <option value="We gold 775">We gold 775</option>
                <option value="We gold 1050">We gold 1050</option>
                <option value="We gold 1300">We gold 1300</option>
                <option value="We gold 2000">We gold 2000</option>
                <option value="We Air 260">We Air 260</option>
                <option value="We air 400">We air 400</option>
                <option value="We air 600">We air 600</option>
                <option value="We air 900">We air 900</option>
                <option value="We air 1100">We air 1100</option>
            </select>
        `;
        container.appendChild(div);
    }
  }
  
  // دالة التحقق من الحقول المطلوبة
  function validateForm() {
    const requiredFields = ['lines', 'wePay', 'data', 'adsl', 'fixed', 'egyption', 'foreign'];
    for (const field of requiredFields) {
      if (!document.getElementById(field).value) {
        alert(`حقل ${field} مطلوب!`);
        return false;
      }
    }
    return true;
  }
  
  // حفظ البيانات مع تحسينات الأمان
  document.getElementById('dataEntryForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    // التحقق من تسجيل الدخول
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        alert('يجب تسجيل الدخول أولاً!');
        window.location.href = 'login.html';
        return;
      }
  
      if (!validateForm()) return;
  
      // جمع البيانات مع التحقق من القيم
      const packages = [];
      const packageInputs = document.querySelectorAll('[name^="package"]');
      
      packageInputs.forEach(input => {
        if (!input.value) {
          alert('يجب اختيار الباقة لكل خط!');
          return;
        }
        packages.push(input.value);
      });
  
      const entry = {
        // البيانات الأساسية
        date: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        
        // بيانات النموذج
        lines: parseInt(document.getElementById('lines').value),
        packages: getSelectedPackages(),
        wePay: parseFloat(document.getElementById('wePay').value),
        data: parseInt(document.getElementById('data').value),
        adsl: parseInt(document.getElementById('adsl').value),
        fixed: parseInt(document.getElementById('fixed').value),
        egyption: parseInt(document.getElementById('egyption').value),
        foreign: parseInt(document.getElementById('foreign').value),
        
        // بيانات إضافية
        ipAddress: await fetch('https://api.ipify.org?format=json')
                    .then(res => res.json())
                    .then(data => data.ip)
                    .catch(() => 'unknown'),
        status: "pending",
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      // دالة مساعدة لجمع الباقات
      function getSelectedPackages() {
        return Array.from(document.querySelectorAll('[name^="package"]'))
                   .map(select => select.value)
                   .filter(pkg => pkg !== "");
      }
      try {
        // إضافة مستند جديد مع ID مخصص
        const docRef = db.collection('salesData').doc();
        await docRef.set(entry);
        
        console.log('Document written with ID: ', docRef.id);
        alert('تم الحفظ بنجاح! سيتم التوجيه إلى لوحة التحكم');
        
        // إعادة تعيين النموذج
        document.getElementById('dataEntryForm').reset();
        document.getElementById('packageContainer').innerHTML = '';
        
        // توجيه المستخدم بعد 2 ثانية
        setTimeout(() => {
          window.location.href = 'sales-dashboard.html';
        }, 2000);
        
      } catch (error) {
        console.error('Error saving data:', error);
        alert(`حدث خطأ: ${error.message}\nالرجاء المحاولة مرة أخرى`);
        
        // إرسال تقرير الخطأ تلقائياً
        db.collection('errorLogs').add({
          error: error.message,
          stack: error.stack,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userId: user ? user.uid : 'anonymous'
        });
      }
    });
  });
  
  // تحميل البيانات عند بدء الصفحة
  document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = 'login.html';
      } else {
        console.log('User authenticated:', user.email);
      }
    });
    if (location.hostname === "localhost") {
        firebase.firestore().useEmulator("localhost", 8080);
        firebase.auth().useEmulator("http://localhost:9099");
      }
  });