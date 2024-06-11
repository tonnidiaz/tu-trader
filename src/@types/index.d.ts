export {};
declare global {
    namespace Next{
        interface NextRequest {
            user: IUser | null;
          }
}
 
}