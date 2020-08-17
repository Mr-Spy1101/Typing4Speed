let plain = 
[
    `cry bird weight name ever hand told just rock noun call eye
school head learn kind red write produce as use white our
by friend surface mountain stop plain happen been once face
set each three move boy
    `
];

let cpp = 
[
`#include <iostream>
#include <iomanip>
using namespace std;

void PrintArray(int ArrayName[], const int ArraySize);
void BubbleSort(int ArrayName[], const int ArraySize);

int main() {
    const int ArraySize = 5;
    int Array1[ArraySize] = {10, 9, 3, 5, 1};

    cout<<"Before Sorting:\\n\\n";
    PrintArray(Array1, ArraySize);

    BubbleSort(Array1, ArraySize);
    cout<<"\\nAfterSorting:\\n\\n";
    PrintArray(Array1, ArraySize);

    return 0;
}`,
`void BubbleSort(int ArrayName[], const int ArraySize){
    int Temp;
    bool IsFound = false;
    for (int i = 1; i < ArraySize; i++)
    {
        for (int j = 0; j < ArraySize - i; j++)
        {
            if (ArrayName[j] > ArrayName[j + 1])
            {
                Temp = ArrayName[j];
                ArrayName[j] = ArrayName[j + 1];
                ArrayName[j + 1] = Temp;
                IsFound = true;
            }
        }
        if (!IsFound)
            break;
    }
}
`,
`   long long mem[N][N / 2 + 10][N / 2 + 10];
    int a[N], b[N];
    long long solve(int ind, int x, int y) {
    if (x == 0 && y == 0)
        return 0;
    if (ind == n || x < 0 || y < 0)
        return 1e9;
    long long &ret = mem[ind][x][y];
    if (~ret)
        return ret;
    long long ch1 = b[ind] + solve(ind + 1, x - 1, y);
    long long ch2 = a[ind] + solve(ind + 1, x, y - 1);
    long long ch3 = solve(ind + 1, x, y);
    return ret = min(ch3, min(ch1, ch2));
}
`
];

let java = 
[
`public class Prime {
    public static void main(String[] args) {
        int low = 20, high = 50;
        while (low < high) {
            if(checkPrimeNumber(low))
                System.out.print(low + " ");
            ++low;
        }
    }
    public static boolean checkPrimeNumber(int num) {
        boolean flag = true;
        for(int i = 2; i <= num/2; ++i) {
            if(num % i == 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
}
`
];

let python = 
[
`list1 = [10, 20, 4, 45, 99]

mx = max(list1[0],list1[1])
secondmax = min(list1[0],list1[1])
n = len(list1)
for i in range(2,n):
    if list1[i]>mx:
        secondmax=mx
        mx=list1[i]
    elif list1[i]>secondmax and mx != list1[i]:
        secondmax=list1[i]
    else:
        if secondmax == mx:
            secondmax = list1[i]

print("Second highest number is : ",str(secondmax))
`
];

module.exports = 
{
    "plain" : plain,
    "cpp" : cpp,
    "java" : java,
    "python" : python
}
