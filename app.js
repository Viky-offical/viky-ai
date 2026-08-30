/* =========================================================
   VIKY AI USER ROLE BADGE
   ========================================================= */

.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  line-height: 1.1;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.65);
}

.role-badge strong {
  font-size: 11px;
  font-weight: 600;
}

.role-badge.admin strong {
  color: #22c55e;
}

.role-badge.user strong {
  color: #22c55e;
}


/* =========================================================
   ADMIN NAV
   ========================================================= */

#adminNav.hidden {
  display: none !important;
}


/* =========================================================
   HIDDEN
   ========================================================= */

.hidden {
  display: none !important;
}


/* =========================================================
   ADMIN BOX
   ========================================================= */

.admin-user-box {
  display: grid;
  gap: 12px;
  margin: 20px 0;
}

.admin-user-box > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
}

.admin-user-box span {
  font-size: 13px;
  opacity: 0.8;
}
