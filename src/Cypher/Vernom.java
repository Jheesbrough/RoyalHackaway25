package Cypher;

import java.security.SecureRandom;

public class Vernom
{
    private String szPad;
    private String szMessage;

    public Vernom(String szNewMessage)
    {
        szMessage = szNewMessage;
        szPad = genPad();

    }

    public String getMessage()
    {
        return szMessage;

    }

    public String getPad()
    {
        return szPad;

    }

    public String genPad()
    {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom RANDOM = new SecureRandom();
        StringBuilder Builder = new StringBuilder(szMessage.length());

        for (int i = 0; i < szMessage.length(); i++)
        {
            int randomIndex = RANDOM.nextInt(CHARACTERS.length());
            Builder.append(CHARACTERS.charAt(randomIndex));

        }

        return Builder.toString();

    }

    public String encrypt(String szRawMessage)
    {
        StringBuilder szEncrMessage = new StringBuilder();

        for (int i = 0 ; i < szRawMessage.length() ; i++)
        {
            int iCurrent = szRawMessage.charAt(i) ^ szPad.charAt(i);

            String szTemp = String.valueOf(iCurrent);

            for (int j = szTemp.length() ; j < 2 ; j++)
            {
                szTemp = 0 + szTemp;
            }

            szEncrMessage.append(szTemp);

        }

        return szEncrMessage.toString();

    }

    public String decrypt(String szEncrMessage , String szReqPad)
    {
//        String szDecrMessage = "";
//
//        for (int i = 0 ; i < szReqPad.length() ; i++)
//        {
//            szDecrMessage = (Integer.parseInt(String.valueOf(szEncrMessage.charAt(i) + "" + szEncrMessage.charAt(i))) ^ szReqPad.charAt(i)) + szDecrMessage;
//
//        }

        StringBuilder plainText = new StringBuilder();
        plainText.append(szEncrMessage);

        for (int i = 0; i < plainText.length(); i++) {
            char decryptedChar = (char) (plainText.charAt(i) ^ szReqPad.charAt(i));
            plainText.append(decryptedChar);
        }
        return plainText.toString();

    }

    public static void main(String[] args)
    {
        Vernom Cypher = new Vernom("aaaa");
        System.out.println(Cypher.getPad());


        String szEncr = Cypher.encrypt(Cypher.getMessage());
        System.out.println(szEncr);

        System.out.println(Cypher.decrypt(szEncr , Cypher.getPad()));


    }

}
