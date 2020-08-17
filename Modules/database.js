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
`def add(x, y):
    return x + y
def subtract(x, y):
    return x - y
def multiply(x, y):
    return x * y
def divide(x, y):
    return x / y

print("Select operation.")
print("1.Add")
print("2.Subtract")
print("3.Multiply")
print("4.Divide")

while True:
    choice = input("Enter choice(1/2/3/4): ")
    if choice in ('1', '2', '3', '4'):
        num1 = float(input("Enter first number: "))
        num2 = float(input("Enter second number: "))
        if choice == '1':
            print(num1, "+", num2, "=", add(num1, num2))
        elif choice == '2':
            print(num1, "-", num2, "=", subtract(num1, num2))
        elif choice == '3':
            print(num1, "*", num2, "=", multiply(num1, num2))
        elif choice == '4':
            print(num1, "/", num2, "=", divide(num1, num2))
        break
    else:
        print("Invalid Input")
`
];

module.exports = 
{
    "plain" : plain,
    "cpp" : cpp,
    "java" : java,
    "python" : python
}
