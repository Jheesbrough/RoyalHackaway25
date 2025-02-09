package BogoSort;

import java.util.Random;
import java.util.Scanner;

public class BogoSort
{
    private int[] iSortingSet;
    private final int iSize;
    private double dShuffles = 0;
    private Random RanNum = new Random();

    public BogoSort(int iReqSize)
    {
        iSize = iReqSize;
        iSortingSet = new int[iSize];

    }

    private void printSet()
    {

        for (int i = 0 ; i < iSize ; i++)
        {
            System.out.print(iSortingSet[i]);

            if (i != (iSize - 1)) System.out.print(" , ");
            if ((i % 20) == 0 && i != 0) System.out.print("\n");

        }

        System.out.println("\n");

    }

    private boolean isSorted()
    {

        for (int i = 0 ; i < iSize - 1 ; i++)
        {
            if (iSortingSet[i] > iSortingSet[i + 1]) return false;

        }

        return true;

    }

    public int[] getSortingSet()
    {
        return iSortingSet;

    }

    public void sortSet()
    {
        while (!isSorted())
        {
            int iTemp;
            int iRanNum;

            for (int i = 0 ; i < iSize ; i++)
            {
                iRanNum = RanNum.nextInt(0 , iSize);
                iTemp = iSortingSet[iRanNum];
                iSortingSet[iRanNum] = iSortingSet[i];
                iSortingSet[i] = iTemp;

            }

            dShuffles++;

        }

    }

    public double getShuffles()
    {
        return dShuffles;

    }

    public static void main(String[] args)
    {
        Random RanNum = new Random();
        BogoSort TheWorst = new BogoSort(8);

        for (int i = 0 ; i < TheWorst.getSortingSet().length ; i++)
        {
            TheWorst.getSortingSet()[i] = RanNum.nextInt(0 , 1000);

        }

        System.out.println("\nYour unsorted set is: \n");
        TheWorst.printSet();

        TheWorst.sortSet();

        System.out.println("Your set has been sorted!");
        System.out.println("Your sorted set is: \n");
        TheWorst.printSet();

        System.out.println("This took " + Math.round(TheWorst.getShuffles()) + " random shuffles");

    }

}