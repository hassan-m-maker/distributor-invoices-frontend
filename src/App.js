import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OvenPage from "./pages/OvenPage";
import CustomersPage from "./pages/CustomersPage";
import './styles.css';
import { getCustomers, addCustomer, getOvens, addOven } from "./db";

function App() {
  useEffect(() => {
    async function seed() {
      // Seed customers
      const existingCustomers = await getCustomers();
      if (existingCustomers.length === 0) {
        const customers = [
          'علي رضا','أبو ربيع','أبو جميل','زكي حلال','أبو محمد','توفيق','حسن المعلم',
          'فرن الملك','Tiger-النبطية','بن الكمال','دجاج و توم','الطيراني','حسن باسمة',
          'أبو علي الشمس','حسن عبد الله','امون','Tiger-عربصاليم','الغدير','المختار',
          'الجنوبي','أبو علي','محمود نضر','مطعم حلا','القصاص','الطيب','مطعم ساري',
          'مطعم كورنر'
        ];
        for (let name of customers) {
          await addCustomer({ name });
        }
      }

      // Seed ovens with products
      const existingOvens = await getOvens();
      if (existingOvens.length === 0) {
        const ovens = [
          {
            id: 1, name: 'الوفاء', products: [
              { name: 'خبز عربي كبير', unit: 'ربطة' },
              { name: 'خبز عربي وسط', unit: 'ربطة' },
              { name: 'خبز عربي صغير', unit: 'ربطة' },
              { name: 'افرنجة اسمر', unit: 'ربطة' },
              { name: 'افرنجة بيبي', unit: 'ربطة' },
              { name: 'افرنجة عادي', unit: 'ربطة' },
              { name: 'كعك مشكل', unit: 'ربطة' },
              { name: 'توست ابيض', unit: 'ربطة' },
              { name: 'توست اسمر', unit: 'ربطة' },
              { name: 'خبز اسمر', unit: 'ربطة' },
              { name: 'خبز همبرغر', unit: 'ربطة' },
              { name: 'خبز فاهيتا', unit: 'ربطة' },
            ]
          },
          {
            id: 2, name: 'القلقاس', products: [
              { name: 'خبز عربي كبير', unit: 'ربطة' },
              { name: 'باين اوليه حليب', unit: 'ربطة' },
              { name: 'باين اوليه شوكولا', unit: 'ربطة' },
              { name: 'توست بتار', unit: 'ربطة' },
              { name: 'خبز فاهيتا', unit: 'ربطة' },
              { name: 'خبز مطاعم', unit: 'ربطة' },
              { name: 'علب بريوش مشكل', unit: 'ربطة' },
              { name: 'كعك مشكل', unit: 'ربطة' },
            ]
          },
          {
            id: 3, name: 'تنور العصر', products: [
              { name: 'تنور مشكل', unit: 'ربطة' },
              { name: 'شعير مشكل', unit: 'ربطة' },
              { name: 'عربي مشكل', unit: 'ربطة' },
              { name: 'مرقوق صغير', unit: 'ربطة' },
              { name: 'شوفان صغير', unit: 'ربطة' },
              { name: 'كعك', unit: 'ربطة' },
              { name: 'كعك مطحون', unit: 'ربطة' },
              { name: 'كرواسون', unit: 'ربطة' },
            ]
          },
          {
            id: 4, name: 'اللايت هاوس', products: [
              { name: 'افرنجة سادة', unit: 'ربطة' },
              { name: 'افرنجة سمسم', unit: 'ربطة' },
              { name: 'خبز همبرغر', unit: 'ربطة' },
              { name: 'خبز فاهيتا', unit: 'ربطة' },
              { name: 'توست زبيب', unit: 'ربطة' },
              { name: 'توست شوكولا', unit: 'ربطة' },
            ]
          },
          {
            id: 5, name: 'الأمراء', products: [
              { name: 'توست كبير', unit: 'ربطة' },
              { name: 'توست صغير', unit: 'ربطة' },
              { name: 'افرنجة سادة', unit: 'ربطة' },
              { name: 'افرنجة سمسم', unit: 'ربطة' },
              { name: 'بيتزا جامبو', unit: 'ربطة' },
              { name: 'بيتزا وسط', unit: 'ربطة' },
              { name: 'توست كانابيه', unit: 'ربطة' },
              { name: 'خبز فيباك', unit: 'ربطة' },
              { name: 'خبز همبرغر', unit: 'ربطة' },
              { name: 'خبز فاهيتا', unit: 'ربطة' },
            ]
          },
          {
            id: 6, name: 'كرواسون كرسبي', products: [
              { name: 'كرواسون مشكل', unit: 'ربطة' },
              { name: 'كيك ريماس مشكل', unit: 'ربطة' },
            ]
          },
        ];
        for (let oven of ovens) {
          await addOven(oven);
        }
      }
    }
    seed();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ovens" element={<OvenPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
