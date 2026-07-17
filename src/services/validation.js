export function validateDedatEmail(email) {

  const emailPattern = /^[A-Za-z0-9._%+-]+@ncdedat\.gov\.za$/;

  return emailPattern.test(email);

}

export function validateGovernmentEmail(email){

    return email.endsWith("@ncdedat.gov.za");

}