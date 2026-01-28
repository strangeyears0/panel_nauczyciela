// src/components/teacher/SubjectDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import TeacherSidebar from '../shared/TeacherSidebar';
import { subjectsApi } from '../../api/subjects';

export default function SubjectDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [subjectRes, studentsRes] = await Promise.all([
                subjectsApi.getById(id),
                subjectsApi.getStudents(id)
            ]);
            setSubject(subjectRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStudentClick = async () => {
        try {
            const { data } = await subjectsApi.getAvailableStudents(id);
            setAvailableStudents(data);
            setShowModal(true);
        } catch (error) {
            console.error("Failed to fetch available students", error);
        }
    };

    const handleAddStudent = async (studentId) => {
        try {
            await subjectsApi.addStudent(id, studentId);
            await fetchData();
            setShowModal(false);
            setSearchTerm('');
        } catch (error) {
            console.error("Failed to add student", error);
            alert('Nie udało się dodać ucznia');
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego ucznia z przedmiotu?')) {
            try {
                await subjectsApi.removeStudent(id, studentId);
                await fetchData();
            } catch (error) {
                console.error("Failed to remove student", error);
                alert('Nie udało się usunąć ucznia');
            }
        }
    };

    const filteredAvailable = availableStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <TeacherSidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0BB95]"></div>
                </main>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="flex h-screen">
                <TeacherSidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nie znaleziono przedmiotu</h2>
                        <button
                            onClick={() => navigate('/teacher/subjects')}
                            className="mt-4 text-[#D0BB95] hover:underline"
                        >
                            Wróć do listy przedmiotów
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <TeacherSidebar />
            <main className="flex-1 overflow-y-auto">
                <Header title={subject.name} />
                <div className="p-8">
                    <div className="mx-auto max-w-4xl">
                        <button
                            onClick={() => navigate('/teacher/subjects')}
                            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Wróć do przedmiotów
                        </button>

                        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#D0BB95]/10">
                                    <span className="material-symbols-outlined text-3xl text-[#D0BB95]">book</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{subject.name}</h2>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">{subject.description}</p>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                                        {students.length} {students.length === 1 ? 'uczeń' : 'uczniów'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Uczniowie</h3>
                            <button
                                onClick={handleAddStudentClick}
                                className="flex items-center gap-2 rounded-lg bg-[#D0BB95] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0ab85] transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Dodaj ucznia
                            </button>
                        </div>

                        {students.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/30">
                                <span className="material-symbols-outlined mx-auto mb-2 block text-3xl text-gray-400">group</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Brak uczniów w tym przedmiocie. Kliknij "Dodaj ucznia" aby przypisać uczniów.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Uczeń</th>
                                            <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                                            <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Klasa</th>
                                            <th className="px-6 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">Akcje</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {student.classes && student.classes.map(c => c.name).join(', ')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleRemoveStudent(student.id)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dodaj ucznia</h3>
                            <button
                                onClick={() => { setShowModal(false); setSearchTerm(''); }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="mb-4">
                            <input
                                type="search"
                                placeholder="Szukaj ucznia..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#D0BB95] focus:outline-none focus:ring-1 focus:ring-[#D0BB95] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {filteredAvailable.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Brak uczniów pasujących do wyszukiwania' : 'Wszyscy uczniowie są już przypisani do tego przedmiotu'}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredAvailable.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    {student.classes && student.classes.map(c => c.name).join(', ')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleAddStudent(student.id)}
                                                className="rounded-lg bg-[#D0BB95] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0ab85] transition-colors"
                                            >
                                                Dodaj
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
