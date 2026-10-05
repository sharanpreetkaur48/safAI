import React, { useState, useEffect } from 'react';
import { User, School, Building2, Check, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSelectorModal: React.FC = () => {
  const {
    role,
    setRole,
    hasCompletedStartup,
    setHasCompletedStartup,
    isRoleSelectorOpen,
    setIsRoleSelectorOpen,
  } = useApp();

  const [showSplash, setShowSplash] = useState(!hasCompletedStartup);
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [authStage, setAuthStage] = useState<'role_select' | 'student_login' | 'student_signup' | 'school_login' | 'school_signup'>('role_select');

  // Student form state
  const [studentIdentifier, setStudentIdentifier] = useState('+91 98112 44910');
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [studentSchool, setStudentSchool] = useState('Green Valley High School');
  const [studentClass, setStudentClass] = useState('Class 10');
  const [studentSection, setStudentSection] = useState('B');

  // School form state
  const [schoolEmail, setSchoolEmail] = useState('coordinator@gvhs.edu');
  const [schoolCode, setSchoolCode] = useState('GVHS-204');
  const [schoolType, setSchoolType] = useState<'Government' | 'Private'>('Private');

  // Flash message
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!hasCompletedStartup) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedStartup]);

  const handleConfirmRole = () => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setAuthStage('student_login');
    } else if (selectedRole === 'school') {
      setAuthStage('school_login');
    } else {
      setHasCompletedStartup(true);
      setIsRoleSelectorOpen(false);
    }
  };

  const handleFinishLogin = (customNotice?: string) => {
    if (customNotice) {
      setConfirmationNotice(customNotice);
      setTimeout(() => {
        setConfirmationNotice(null);
        setHasCompletedStartup(true);
        setIsRoleSelectorOpen(false);
      }, 1200);
    } else {
      setHasCompletedStartup(true);
      setIsRoleSelectorOpen(false);
    }
  };

  if (!isRoleSelectorOpen && hasCompletedStartup) {
    return null;
  }

  // Minimal splash screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F8F6] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#E8F4ED] border border-[#167A4A]/20 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-[#167A4A]">s</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#17201B]">safAI</h1>
        <p className="text-sm text-[#6B746E] mt-1.5 font-medium max-w-xs">
          Cleaner communities. Healthier tomorrow.
        </p>
        <div className="mt-8 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#167A4A] animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#167A4A] animate-pulse delay-100" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#167A4A] animate-pulse delay-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#F7F8F6] rounded-2xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-8 my-auto">
        {hasCompletedStartup && (
          <button
            type="button"
            onClick={() => {
              setIsRoleSelectorOpen(false);
              setAuthStage('role_select');
            }}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Confirmation Banner */}
        {confirmationNotice && (
          <div className="mb-4 p-3 rounded-lg bg-[#E8F4ED] border border-[#167A4A]/30 text-xs font-medium text-[#167A4A] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#167A4A]" />
            <span>{confirmationNotice}</span>
          </div>
        )}

        {/* STAGE 1: ROLE SELECTION */}
        {authStage === 'role_select' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#E8F4ED] text-[#167A4A] font-bold text-lg mb-2">
                s
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#17201B]">
                Welcome to safAI
              </h2>
              <p className="text-sm text-[#6B746E] mt-1">
                Choose how you use safAI
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {/* Option 1: Student */}
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  selectedRole === 'student'
                    ? 'border-[#167A4A] bg-[#E8F4ED]/50 ring-1 ring-[#167A4A]'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === 'student' ? 'bg-[#167A4A] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#17201B]">Student</span>
                    {selectedRole === 'student' && <Check className="w-4 h-4 text-[#167A4A]" />}
                  </div>
                  <p className="text-xs text-[#6B746E] mt-0.5 leading-relaxed">
                    Report observations, join supervised activities and track your contribution.
                  </p>
                </div>
              </button>

              {/* Option 2: School / Teacher */}
              <button
                type="button"
                onClick={() => setSelectedRole('school')}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  selectedRole === 'school'
                    ? 'border-[#167A4A] bg-[#E8F4ED]/50 ring-1 ring-[#167A4A]'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === 'school' ? 'bg-[#167A4A] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <School className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#17201B]">School / Teacher</span>
                    {selectedRole === 'school' && <Check className="w-4 h-4 text-[#167A4A]" />}
                  </div>
                  <p className="text-xs text-[#6B746E] mt-0.5 leading-relaxed">
                    Manage Eco Clubs, NSS groups, students, activities and assigned hotspots.
                  </p>
                </div>
              </button>

              {/* Option 3: Municipality */}
              <button
                type="button"
                onClick={() => setSelectedRole('municipality')}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  selectedRole === 'municipality'
                    ? 'border-[#167A4A] bg-[#E8F4ED]/50 ring-1 ring-[#167A4A]'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === 'municipality' ? 'bg-[#167A4A] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#17201B]">Municipality</span>
                    {selectedRole === 'municipality' && <Check className="w-4 h-4 text-[#167A4A]" />}
                  </div>
                  <p className="text-xs text-[#6B746E] mt-0.5 leading-relaxed">
                    Verify hotspots, assign sanitation work and track recurring locations.
                  </p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirmRole}
              className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#12633C] active:scale-[0.99] transition-all"
            >
              <span>
                {selectedRole === 'student' && 'Continue as Student'}
                {selectedRole === 'school' && 'Continue as School'}
                {selectedRole === 'municipality' && 'Continue as Municipality'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STAGE 2: STUDENT LOGIN */}
        {authStage === 'student_login' && (
          <div>
            <button
              type="button"
              onClick={() => setAuthStage('role_select')}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 mb-4 inline-flex items-center gap-1"
            >
              ← Back to roles
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-[#17201B]">Welcome back</h2>
              <p className="text-xs text-[#6B746E] mt-0.5">Sign in to continue as a Student</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Mobile number or School ID
                </label>
                <input
                  type="text"
                  value={studentIdentifier}
                  onChange={(e) => setStudentIdentifier(e.target.value)}
                  placeholder="+91 XXXXX XXXXX or GV-2024-104"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 bg-white text-sm text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFinishLogin()}
                className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center hover:bg-[#12633C] active:scale-[0.99] transition-all"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={() => handleFinishLogin()}
                className="w-full h-11 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
              >
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="text-center pt-2 border-t border-stone-200 text-xs text-stone-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthStage('student_signup')}
                className="text-[#167A4A] font-semibold hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: STUDENT SIGNUP */}
        {authStage === 'student_signup' && (
          <div>
            <button
              type="button"
              onClick={() => setAuthStage('student_login')}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 mb-3 inline-flex items-center gap-1"
            >
              ← Back to Sign In
            </button>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-[#17201B]">
                Create your student account
              </h2>
              <p className="text-xs text-[#6B746E] mt-0.5">
                Join your school's environmental action team
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">School</label>
                <input
                  type="text"
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Mobile number</label>
                <input
                  type="text"
                  value={studentIdentifier}
                  onChange={(e) => setStudentIdentifier(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFinishLogin(`You're connected to ${studentSchool}`)}
              className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center hover:bg-[#12633C] active:scale-[0.99] transition-all"
            >
              Create account
            </button>
          </div>
        )}

        {/* STAGE 4: SCHOOL LOGIN */}
        {authStage === 'school_login' && (
          <div>
            <button
              type="button"
              onClick={() => setAuthStage('role_select')}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 mb-4 inline-flex items-center gap-1"
            >
              ← Back to roles
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-[#17201B]">
                Welcome, School Coordinator
              </h2>
              <p className="text-xs text-[#6B746E] mt-0.5">
                Sign in to manage Eco Clubs & NSS activities
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">School email</label>
                <input
                  type="email"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 bg-white text-sm text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 bg-white text-sm text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFinishLogin()}
                className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center hover:bg-[#12633C] active:scale-[0.99] transition-all"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => handleFinishLogin()}
                className="w-full h-11 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
              >
                <span>Continue with Google Workspace</span>
              </button>
            </div>

            <div className="text-center pt-2 border-t border-stone-200 text-xs text-stone-500">
              Need to enroll your institution?{' '}
              <button
                type="button"
                onClick={() => setAuthStage('school_signup')}
                className="text-[#167A4A] font-semibold hover:underline"
              >
                Register your school
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: SCHOOL REGISTRATION */}
        {authStage === 'school_signup' && (
          <div>
            <button
              type="button"
              onClick={() => setAuthStage('school_login')}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 mb-3 inline-flex items-center gap-1"
            >
              ← Back to Sign In
            </button>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-[#17201B]">
                Register your school
              </h2>
              <p className="text-xs text-[#6B746E] mt-0.5">
                Join municipal sanitation alignment network
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">School name</label>
                <input
                  type="text"
                  defaultValue="Green Valley High School"
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">School code</label>
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">School type</label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Other">Other / Aided</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Coordinator name</label>
                <input
                  type="text"
                  defaultValue="Dr. Meera Singh"
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFinishLogin('Registration submitted. Institutional verification active.')}
              className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center hover:bg-[#12633C] active:scale-[0.99] transition-all"
            >
              Create School Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
