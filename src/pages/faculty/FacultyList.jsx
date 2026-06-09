import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";

import API from "../../api/axios";

function FacultyList() {
  const [faculties, setFaculties] =
    useState([]);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties =
    async () => {
      try {
        const res =
          await API.get(
            "/faculties"
          );

        setFaculties(
          res.data.faculties
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-5xl font-serif text-yellow-400 mb-10">
          Faculty
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {faculties.map(
            (faculty) => (
              <div
                key={faculty._id}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-7 backdrop-blur-xl"
              >
                <h2 className="text-3xl font-serif text-yellow-400">
                  {faculty.name}
                </h2>

                <p className="text-white/50 mt-2">
                  {
                    faculty.email
                  }
                </p>

                <div className="mt-6 space-y-2">
                  <p>
                    Department:{" "}
                    {
                      faculty.department
                    }
                  </p>

                  <p>
                    Designation:{" "}
                    {
                      faculty.designation
                    }
                  </p>

                  <p>
                    Phone:{" "}
                    {
                      faculty.phone
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyList;