Basic user identification ✅
XP amount ✅

grades
audits
skills


gQL query
{
	user {
    id
    firstName
    lastName
    email
  }
  transaction(where: { type: { _eq: "xp" } }) {
    type
    amount
  }
}

  audit {
    auditorLogin
    auditor {
      id
    }
    grade
    createdAt
    endAt
    result {
      id
    }
  }

  look at path